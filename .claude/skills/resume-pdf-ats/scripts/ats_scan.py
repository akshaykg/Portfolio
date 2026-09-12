#!/usr/bin/env python3
"""End-to-end ATS check for the resume HTML.

Renders the HTML through headless Chrome's print pipeline, extracts the PDF text
layer, then parses it the way a conventional rule-based ATS does: segment the
document by recognised section headers, run entity extraction inside each
segment. Parsers of that class trust reading order, which is exactly what CSS
can silently destroy.

    python3 ats_scan.py ../../../Akshay_KG_Anthropic_Resume_Enhanced.html

Exit code 0 = all checks pass, 1 = at least one failure.
Pass --keep to leave the intermediate PDF and text next to the HTML.
"""
import os
import re
import subprocess
import sys
import tempfile

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Codes and terms that must survive as contiguous, searchable strings. Recruiters
# search these verbatim; a mid-token line break makes them invisible.
KEYWORDS = [
    "AWS", "Azure", "Kubernetes", "Terraform", "Python", "TypeScript", "CI/CD",
    "REST APIs", "AZ-104", "AZ-204", "AZ-500", "AZ-900", "AZ-303", "AZ-304",
    "SAFe", "Microservices", "OAuth", "PowerShell", "Node.js", "LLM",
    "Prompt Engineering", "Cloud Security",
]

SECTION_VOCAB = {
    "experience": ["professional experience", "work experience", "experience",
                   "employment history", "work history"],
    "education":  ["education", "academic background"],
    "skills":     ["skills", "core capabilities", "technical skills", "competencies"],
    "certs":      ["certifications", "certificates", "licenses"],
    "projects":   ["projects", "selected solutions", "portfolio"],
    "contact":    ["connect", "contact"],
    "summary":    ["summary", "profile", "objective"],
}

DATE = re.compile(
    r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(\d{4})"
    r"\s*[–—-]\s*"
    r"(Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4})",
    re.I,
)
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
PHONE = re.compile(r"(\+\d{1,3}[ -]?)?\d{10}\b")
URL = re.compile(r"(?:linkedin\.com/in/[\w-]+|[\w-]+\.(?:dev|com|io)(?:/[\w-]*)?)")


def render_pdf(html_path, pdf_path):
    """Print the HTML to PDF exactly as the browser's Save-as-PDF would."""
    if not os.path.exists(CHROME):
        sys.exit(f"Chrome not found at {CHROME}")
    # Chrome refuses to load subresources from file:// in some configurations,
    # so serve the directory instead of opening the file directly.
    root = os.path.dirname(os.path.abspath(html_path)) or "."
    name = os.path.basename(html_path)
    srv = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8917", "--bind", "127.0.0.1"],
        cwd=root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        import time
        time.sleep(1.2)
        subprocess.run(
            [CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
             f"--print-to-pdf={pdf_path}", f"http://127.0.0.1:8917/{name}"],
            check=True, capture_output=True, timeout=120,
        )
    finally:
        srv.terminate()
        srv.wait(timeout=10)


def extract_text(pdf_path):
    try:
        from pypdf import PdfReader
    except ImportError:
        sys.exit("pypdf missing. See SKILL.md -> Verification setup.")
    reader = PdfReader(pdf_path)
    pages = [p.extract_text() or "" for p in reader.pages]
    return "\n".join(pages), len(pages)


def header_kind(line):
    """An ATS header heuristic: short, uppercase-ish, in the known vocabulary."""
    s = line.strip().strip("·").strip()
    if not s or len(s) > 40:
        return None
    if not (s.isupper() or s.istitle()):
        return None
    low = s.lower()
    for kind, names in SECTION_VOCAB.items():
        if low in names:
            return kind
    return None


def segment(lines):
    segments, cur, buf = [], "PREAMBLE", []
    for line in lines:
        kind = header_kind(line)
        if kind:
            segments.append((cur, buf))
            cur, buf = kind, []
        else:
            buf.append(line)
    segments.append((cur, buf))
    return segments


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    keep = "--keep" in sys.argv
    if not args:
        sys.exit(__doc__)
    html = args[0]

    outdir = os.path.dirname(os.path.abspath(html)) if keep else tempfile.mkdtemp()
    pdf = os.path.join(outdir, "ats-check.pdf")

    print(f"rendering {os.path.basename(html)} -> PDF ...")
    render_pdf(html, pdf)
    text, npages = extract_text(pdf)
    if keep:
        with open(os.path.join(outdir, "ats-check.txt"), "w", encoding="utf-8") as fh:
            fh.write(text)

    lines = [l.rstrip() for l in text.split("\n")]
    nonblank = [l for l in lines if l.strip()]
    failures = []

    print(f"pages: {npages}   extracted characters: {len(text)}")
    if len(text) < 1500:
        failures.append(
            "TEXT LAYER: almost no extractable text - the PDF is probably a "
            "rasterised image. Check that export uses window.print()."
        )

    # --- segmentation ----------------------------------------------------
    segments = segment(lines)
    print("\n" + "=" * 68)
    print("SECTION SEGMENTATION")
    print("=" * 68)
    for name, body in segments:
        body_txt = [b for b in body if b.strip()]
        preview = " | ".join(body_txt[:3])[:84]
        print(f"  {name:<11} {len(body_txt):>3} lines   {preview}")

    # --- contact ---------------------------------------------------------
    blob = "\n".join(nonblank[:12])
    email = EMAIL.search(blob)
    phone = PHONE.search(blob)
    urls = sorted(set(URL.findall(blob)))
    print("\n" + "=" * 68)
    print("CONTACT EXTRACTION")
    print("=" * 68)
    print("  name   :", nonblank[0] if nonblank else "NOT FOUND")
    print("  email  :", email.group() if email else "NOT FOUND")
    print("  phone  :", phone.group().strip() if phone else "NOT FOUND")
    print("  urls   :", urls or "NOT FOUND")
    if not email:
        failures.append("CONTACT: no email found in the header block.")
    if not phone:
        failures.append("CONTACT: no phone found in the header block.")

    # --- work history ----------------------------------------------------
    exp_body = [b for n, b in segments if n == "experience"]
    exp_lines = exp_body[0] if exp_body else []
    jobs = []
    for i, line in enumerate(exp_lines):
        if DATE.search(line):
            title = ""
            for j in range(i - 1, max(-1, i - 3), -1):
                if exp_lines[j].strip():
                    title = exp_lines[j].strip()
                    break
            jobs.append((title, line.strip()))

    print("\n" + "=" * 68)
    print("WORK HISTORY (parsed from inside the EXPERIENCE segment)")
    print("=" * 68)
    for title, dates in jobs:
        print(f"  title/company : {title[:64]}")
        print(f"  dates         : {dates[:64]}\n")
    if not jobs:
        print("  *** NO JOBS FOUND IN THE EXPERIENCE SECTION ***\n")
        failures.append(
            "WORK HISTORY: the experience section parsed empty. Reading order is "
            "broken - see SKILL.md rules R2 (positioned blocks) and R3 (columns)."
        )

    stray = [(n, l.strip()) for n, body in segments if n != "experience"
             for l in body if DATE.search(l)]
    if stray:
        print("  DATE RANGES FOUND OUTSIDE THE EXPERIENCE SECTION:")
        for name, line in stray:
            print(f"    [{name}] {line[:66]}")
        failures.append(
            f"READING ORDER: {len(stray)} employment date range(s) landed outside "
            "the experience section."
        )

    # --- keywords --------------------------------------------------------
    flat = re.sub(r"\s+", " ", text).lower()
    missed = [k for k in KEYWORDS if k.lower() not in flat]
    print("=" * 68)
    print("KEYWORD MATCH (exact substring, as an ATS index would)")
    print("=" * 68)
    print(f"  matched {len(KEYWORDS) - len(missed)}/{len(KEYWORDS)}")
    print("  MISSED :", ", ".join(missed) if missed else "none")
    if missed:
        failures.append(
            "KEYWORDS: " + ", ".join(missed) + " not present as contiguous strings "
            "- usually a narrow column wrapping a token mid-word (rule R4)."
        )

    # --- verdict ---------------------------------------------------------
    print("\n" + "=" * 68)
    if failures:
        print(f"FAILED - {len(failures)} issue(s)")
        print("=" * 68)
        for f in failures:
            print(f"  - {f}")
        return 1
    print("PASSED - all checks clean")
    print("=" * 68)
    return 0


if __name__ == "__main__":
    sys.exit(main())
