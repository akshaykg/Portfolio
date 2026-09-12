---
name: resume-pdf-ats
description: "Rules and verification for editing Akshay_KG_Anthropic_Resume_Enhanced.html — the single-file interactive resume whose PDF export must stay ATS-parseable. Use before ANY change to that file's CSS, print styles, export button, or section markup. Covers the non-obvious CSS traps that silently destroy the PDF text layer or its reading order, and ships a runnable scan that proves the output still parses."
---

# Resume PDF / ATS rules

`Akshay_KG_Anthropic_Resume_Enhanced.html` is a self-contained single-file resume
(~4MB; images are inline base64). It has two independent layouts:

- **Screen** — two-column, interactive, photo pan/zoom controls.
- **Print** — what `@media print` produces. **This is the artifact recruiters and
  ATS systems actually consume.** It is the one that matters for parsing.

Changing the screen layout is low-risk. Changing anything the print layout touches
is high-risk in a way that is invisible on screen: the PDF still *looks* perfect
while its text layer silently becomes unparseable.

## Before you start

The file is **gitignored and untracked** (`.gitignore`) — there is no git safety
net. Copy it somewhere before editing:

```bash
cp Akshay_KG_Anthropic_Resume_Enhanced.html /tmp/resume-backup-$(date +%s).html
```

## The hard rules

Each of these was a real, measured failure. The "why" matters more than the rule —
the same trap reappears in new forms.

### R1. Export must be `window.print()`. Never a canvas rasteriser.

The file previously used `html2pdf.js` → `html2canvas`, which paints the DOM into
a `<canvas>`, exports it as JPEG, and embeds that image as the page. A PDF built
that way contains **no font objects and no text-drawing operators** — there is
literally nothing to select, copy, or parse. Extraction returns 0 characters.

Never reintroduce `html2pdf`, `html2canvas`, or `jsPDF.html()`. The export handler
(~line 399) calls `window.print()` and temporarily sets `document.title` so
Chrome/Safari seed the Save-as-PDF filename, restoring it on `afterprint` with a
timeout fallback.

### R2. No `position: relative/absolute` on content blocks in print.

**The subtlest trap in this file.** `.block` carries `position:relative` purely to
anchor a decorative timeline dot (`.block:before`). In CSS paint order, positioned
elements paint in a **later phase** than normal-flow content — so every job entry
was written into the PDF content stream *after* every section heading, regardless
of column layout. Result: the experience section parsed empty and all three jobs
were attributed to whatever section came last.

Nothing about the rendered page hints at this. The print block therefore forces:

```css
.block{position:static!important}
.block:before{display:none!important}
```

If you add a decorative pseudo-element anywhere in the resume body, either keep its
parent unpositioned in print, or accept that its content moves to the end of the
text layer. The timeline rail survives because it is a `border-left` on `.timeline`,
not a positioned element — prefer borders and backgrounds over positioned overlays.

### R3. `.main-grid` stays single-column in print.

A two-column grid makes a linear parser read the right-hand sidebar as the *body*
of "Professional Experience". Capabilities, certifications and education get
absorbed into the work-history section, and job entries get attributed to whichever
header was opened last.

```css
.main-grid{display:block!important}
.main-grid > div{width:100%!important}
```

The DOM order is already correct (Experience → Selected Solutions → Capabilities →
Certifications → Education → Connect), so a single column yields correct reading
order for free. Screen layout keeps its two columns.

### R4. Hyphenated codes must never break across lines.

`.cert-list` is two-column, and the narrow measure used to wrap certification
codes mid-token:

```
Engineer — AZ-
500
```

`AZ-500`, `AZ-204` and `AZ-104` therefore did not exist as contiguous strings, and
recruiters searching those codes verbatim would not match.

Each code is wrapped in `<span class="nb">` (`white-space:nowrap`), which forbids
the break while keeping the characters intact. **Do not substitute a non-breaking
hyphen (U+2011)** — it would stop the wrap but change the extracted text, so
`AZ-500` would no longer match a plain-ASCII search.

Any new hyphenated identifier (cert codes, `CKA-`, ticket refs) needs the same
`nb` span.

### R4a. `display:flex` drops whitespace between flex items.

`.cert-list li` is a flex container. When the `nb` spans sat directly inside it
they became sibling flex items, and **whitespace between flex items is not
rendered** — `— AZ-303, AZ-304` displayed as `—AZ-303,AZ-304`. The whole label is
therefore wrapped in a single `<span class="cert-name">`, making it one flex item
so the inner spans are ordinary inline content and the spaces survive.

Adding any inline element inside a flex container hits this. Wrap, don't nest bare.

### R4b. Normalise badge art, not just the CSS box.

Two separate problems, and fixing only the first creates the second.

**The box.** The SAFe RTE badge canvas is 80×60 while every other badge is 80×80.
With `height:40px;width:auto` it rendered 53.3px wide and pushed its label ~13px
right of the others. `.cert-badge` is now
`width:40px;height:40px;object-fit:contain;flex:0 0 40px` — identical footprint
whatever the aspect ratio.

**The artwork.** Equal boxes still rendered unequal-looking badges, because the
sources carried different amounts of transparent padding. Measured alpha bounding
boxes:

| Badge | Canvas | Artwork | Fill |
|---|---|---|---|
| SAFe 6 | 80×80 | 64×74 | 80% × 92% |
| SAFe RTE | 80×60 | 48×54 | 60% × 90% |
| Azure Expert | 80×80 | 74×76 | 92% × 95% |

`object-fit:contain` fits the *canvas*, so RTE rendered 40×30 against the others'
40×40 — visibly smaller. All seven PNGs are now trimmed to their alpha bounding
box, so every badge renders 40px tall (widths 34.6–39px).

When adding a badge, trim it first:

```python
from PIL import Image
im = Image.open(src).convert("RGBA")
im.crop(im.getbbox()).save(dst, format="PNG", optimize=True)
```

### R5. Scope `break-inside: avoid` to leaf blocks only.

`*{page-break-inside:avoid}` applied to every element — including `.resume` and the
grid containers — fights pagination and can clip content. Keep it on leaves:

```css
.block,.project,.metric,.skill-group,.cert,.edu,.qr-item{
  page-break-inside:avoid!important;break-inside:avoid!important}
h1,h2,h3{page-break-after:avoid!important;break-after:avoid!important}
```

### R6. Vertical page spacing belongs on `@page`, not `.resume`.

`.resume` padding applies **once**, at the start and end of the whole flow — so
page 2 onward began flush against the paper edge with no top margin. Only `@page`
margin repeats on every page. The split is now:

```css
@page{size:A4;margin:11mm 0 9mm}          /* vertical, every page */
.resume{padding:0 12mm!important}          /* horizontal only */
```

Never move the vertical values back into `.resume` padding — it looks correct on a
one-page render and silently breaks every page after the first.

### R7. Pagination must survive both A4 and Letter.

`@page` declares A4, but the user's print dialog can select Letter (17.6mm
shorter), and the break positions move. Always test both — the helper below
renders each.

Two traps found this way:

- **`break-inside:avoid` on a tall container overflows into a blank page.**
  `.project-grid{break-inside:avoid}` looked reasonable — keep the five solution
  cards together — but on Letter it produced a **blank third page**. Individual
  `.project` cards already carry `break-inside:avoid`, so the grid can only split
  between rows, never through a card. That is the acceptable trade; the blank page
  is not. Only `.qr-row` and `.metrics` (both short, single-row) carry container
  level avoid.
- **Avoid rules interact with paper size.** A rule that paginates cleanly on A4 can
  strand content or blank a page on Letter. Never add a container-level
  `break-inside:avoid` without re-rendering both sizes and checking for blank pages.

Check for blank pages explicitly — they extract as empty strings and are easy to
miss in a visual skim:

```bash
python3 -c "
import io
s=io.open('Akshay_KG_Anthropic_Resume_Enhanced.html',encoding='utf-8').read()
io.open('letter-test-tmp.html','w',encoding='utf-8').write(
    s.replace('@page{size:A4;margin:11mm 0 9mm}','@page{size:Letter;margin:11mm 0 9mm}',1))
"
# render letter-test-tmp.html, confirm no page extracts as empty, then delete it
```

Current state: **A4 2 pages** (break at the Core Capabilities section boundary),
**Letter 2 pages** (break between Selected Solutions rows). No blank pages on either.

## Verification — mandatory after any print/layout change

Never trust a visual check. The failures above are all invisible on screen.

```bash
.claude/skills/resume-pdf-ats/.venv/bin/python \
  .claude/skills/resume-pdf-ats/scripts/ats_scan.py \
  Akshay_KG_Anthropic_Resume_Enhanced.html
```

The script renders the HTML through headless Chrome's real print pipeline,
extracts the PDF text layer, and parses it the way a rule-based ATS does. Exit 0 =
clean, exit 1 = failures, each naming the rule it violates. Add `--keep` to leave
`ats-check.pdf` / `ats-check.txt` next to the HTML for inspection.

A passing run looks like:

```
pages: 2   extracted characters: 4075
  experience   23 lines   Applied AI & Enterprise Enablement — BT Group | 2023 – Present ...
WORK HISTORY (parsed from inside the EXPERIENCE segment)
  title/company : Applied AI & Enterprise Enablement — BT Group
  title/company : Consultant / Tools Architect — BT Group
  title/company : Assistant System Engineer — Tata Consultancy Services
  matched 22/22
PASSED - all checks clean
```

**The signal that matters most is that `experience` has a non-zero line count and
three jobs parse inside it.** If jobs appear under `[projects]` or `[education]` in
the "DATE RANGES FOUND OUTSIDE" list, reading order is broken — check R2 first,
then R3.

### Verification setup

The venv is gitignored; recreate it if missing:

```bash
python3 -m venv .claude/skills/resume-pdf-ats/.venv
.claude/skills/resume-pdf-ats/.venv/bin/pip install pypdf
```

Requires Google Chrome at `/Applications/Google Chrome.app`.

### Seeing the print layout on screen

To eyeball the print layout without a print dialog, retarget the media query in a
throwaway copy:

```bash
python3 -c "
import io
s=io.open('Akshay_KG_Anthropic_Resume_Enhanced.html',encoding='utf-8').read()
io.open('print-preview-tmp.html','w',encoding='utf-8').write(s.replace('@media print{','@media screen{',1))
"
# open print-preview-tmp.html, then delete it
```

Do **not** click the ⬇ PDF button during browser automation — it opens a modal
print dialog that blocks all further automation events.

## File landmarks

Line numbers drift; search rather than trusting them.

| What | Where |
|---|---|
| `:root` tokens | top of `<style>` |
| `@page{size:A4;margin:11mm 0 9mm}` | ~line 129 |
| `@media(max-width:850px)` | ~line 128 |
| **`@media print{ ... }`** | **~lines 134–154 — the block that matters** |
| `.timeline` / `.block` / `.block:before` | ~lines 89–96 |
| `<main class="resume">` | ~line 158 |
| `.main-grid` + its two column `<div>`s | ~line 188 |
| Export handler | ~line 399 |

Section markup order inside `.main-grid`: left `<div>` holds Professional
Experience + Selected Solutions; right `<div>` holds Core Capabilities,
Certifications, Education, Connect.

## Known open issues (content, not layout)

Not fixed — they need editorial decisions, not CSS:

1. **Two concurrent "Present" roles at BT Group** (`2023 – Present` and
   `June 2019 – Present`). Naive tenure summing reads ~12.7 years against the
   stated "nearly 10". Merging into one entry with sub-roles would resolve it.
2. **Metrics orphan their labels** — `3` and `engineering teams led` extract as
   separate lines, so "led 3 teams" is not semantically recoverable. Low severity.
3. **Non-canonical section headers** — `CORE CAPABILITIES` and `SELECTED SOLUTIONS`
   rather than `Skills` / `Projects`. The scanner carries synonyms; stricter
   parsers match only canonical names.

## Scope note

This models a conventional rule-based parser (segment by header, extract within
segment) — the floor any resume must clear, and what most mid-market ATS still run.
Newer LLM-backed parsers reconstruct layout from glyph coordinates and would likely
recover more. Treat a passing scan as necessary, not sufficient.

Never add hidden keyword text, white-on-white content, or invisible render-mode
(`3 Tr`) keyword stuffing. It is detectable precisely because it lands in the text
layer, modern ATS flag text that never renders, and it gets candidates rejected.
