/**
 * KG Akshay Hebbar — Portfolio Website Interactivity
 * Theme Management, Product Filtering, Interactive Modals, Clipboard & Scroll Reveals
 */

(function () {
  'use strict';

  // --- Project Data for Modal Dialogs ---
  const PROJECT_DATA = {
    apistudio: {
      title: 'API Studio',
      platform: 'VS Code Extension & CLI Tool',
      icon: 'assets/projects/apistudio_icon.png',
      images: [
        'assets/projects/apistudio/1.png',
        'assets/projects/apistudio/2.png',
        'assets/projects/apistudio/3.png'
      ],
      badge: 'Live · Offline First',
      badgeClass: 'badge-live',
      tagline: 'Fully offline, privacy-first API client & mock engine for modern engineering workflows.',
      description:
        'A comprehensive, privacy-first API client engineered directly into VS Code and the CLI. Supports REST, GraphQL, WebSocket, and gRPC with zero telemetry, zero accounts, and an encrypted vault. Features Git-native JSON collections, mock servers, and Model Context Protocol (MCP) server management.',
      features: [
        'REST, GraphQL, WebSocket & gRPC protocols',
        'Local Mock Server with route management & Swagger UI',
        'Model Context Protocol (MCP) Server integrations',
        'AES-256 Encrypted local secret vault',
        'Command-line interface (CLI) for automated CI/CD runs',
        'Git-friendly plain JSON collections and environments'
      ],
      links: [
        { label: 'View Documentation', url: 'https://docs.vectored.dev/apistudio/', primary: true },
        { label: 'GitHub Repository', url: 'https://github.com/openAPI-Studio', primary: false }
      ]
    },
    forms: {
      title: 'Forms & Frontdoor',
      platform: 'Atlassian Confluence App',
      icon: 'assets/projects/forms_icon.png',
      images: [
        'assets/projects/forms/1.png',
        'assets/projects/forms/2.png',
        'assets/projects/forms/3.png'
      ],
      badge: 'Live · Marketplace',
      badgeClass: 'badge-live',
      tagline: 'Visual form builder with multi-section workflows & post-submit automation canvas.',
      description:
        'Empowers teams to design beautiful, dynamic forms with 13 field types directly inside Confluence. Features granular access controls, multi-section step navigation, and a visual automation canvas that auto-generates Confluence pages, creates Jira tickets, and triggers Slack/Teams notifications upon submission.',
      features: [
        'Visual drag-and-drop form builder with 13 field types',
        'Post-submission visual automation canvas',
        'Automated Confluence page & Jira issue creation',
        'Instant Slack and Microsoft Teams webhook alerts',
        'CSV export & secure response table viewer',
        'Space-level permissions & co-owner management'
      ],
      links: [
        { label: 'Atlassian Marketplace', url: 'https://marketplace.atlassian.com/apps/2466520058/forms-frontdoor-by-vectored?hosting=cloud&tab=overview', primary: true },
        { label: 'Documentation & Guide', url: 'https://docs.vectored.dev/forms/', primary: false }
      ]
    },
    macrotoolkit: {
      title: 'Macro Toolkit',
      platform: 'Atlassian Confluence App',
      icon: 'assets/projects/macrotoolkit_icon.png',
      images: [
        'assets/projects/macrotoolkit/1.png',
        'assets/projects/macrotoolkit/2.png',
        'assets/projects/macrotoolkit/3.png'
      ],
      badge: 'Live · 15 Macros',
      badgeClass: 'badge-live',
      tagline: 'Power suite of 15 essential macros for modern Confluence documentation.',
      description:
        'Supercharges Atlassian Confluence with interactive visual macros. Render diagrams as code with Mermaid and PlantUML, embed Excalidraw whiteboards, explore OpenAPI/Swagger contracts live, and engage teams with real-time polls, mood boards, and interactive carousels.',
      features: [
        'Mermaid, PlantUML & Excalidraw diagrams as code',
        'Interactive Swagger & OpenAPI API contract viewer',
        'Team polls, mood boards & reaction meters',
        'Markdown viewer with live code syntax highlighting',
        'Interactive media carousels & spoiler reveals',
        '100% Forge-native security and tenant isolation'
      ],
      links: [
        { label: 'Atlassian Marketplace', url: 'https://marketplace.atlassian.com/apps/3972300183', primary: true },
        { label: 'Macro Catalog & Docs', url: 'https://docs.vectored.dev/macrotoolkit/', primary: false }
      ]
    },
    rewardhub: {
      title: 'Recognition Hub',
      platform: 'Confluence & Jira App',
      icon: 'assets/projects/rewardhub_icon.png',
      images: [
        'assets/projects/rewardhub/1.png',
        'assets/projects/rewardhub/2.png',
        'assets/projects/rewardhub/3.png'
      ],
      badge: 'Live · Marketplace',
      badgeClass: 'badge-live',
      tagline: 'Peer recognition mural celebrating company culture inside Jira and Confluence.',
      description:
        'A social recognition and kudos engine embedded where engineers and product teams collaborate daily. Features an interactive mural of peer appreciation, alignment to corporate values, AI-assisted recognition drafting, rich email notifications, and leaderboards.',
      features: [
        'Live interactive kudos mural on any page or dashboard',
        'Company value alignment tags & customizable badges',
        'Integrated AI assistant to help draft inspiring praise',
        'Rich HTML email notifications via Amazon SES',
        'GIPHY integration, reactions & social commenting',
        'Content moderation, reporting & manager analytics'
      ],
      links: [
        { label: 'Atlassian Marketplace', url: 'https://marketplace.atlassian.com/apps/564712405', primary: true },
        { label: 'Documentation', url: 'https://docs.vectored.dev/rewardhub/', primary: false }
      ]
    },
    lens: {
      title: 'Lens by Vectored',
      platform: 'Chrome & Edge Extension',
      icon: 'assets/projects/lens_icon.png',
      images: [
        'assets/projects/lens/1.png',
        'assets/projects/lens/2.png',
        'assets/projects/lens/3.png'
      ],
      badge: 'Live · Chrome Store',
      badgeClass: 'badge-live',
      tagline: 'High-definition tab capture, GIF/MP4 recorder & annotation tool for technical writers.',
      description:
        'A browser extension engineered specifically for developer and software documentation. Capture high-res screenshots or record smooth GIFs and MP4 videos with zero server uploads. Includes pixelation/blur redaction, callout annotations, and automatic timeline organization in local folders.',
      features: [
        'Instant tab area selection for PNG screenshots',
        'High-fps GIF and MP4 video screen recording',
        'Built-in annotation tools: arrows, steps, text & blur',
        'Auto-filing into local project folders with metadata',
        '100% offline — zero tracking, telemetry, or account required',
        'Works seamlessly on Google Chrome, Brave, and Microsoft Edge'
      ],
      links: [
        { label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/detail/lens-by-vectored-tab-capt/gjonlnbkjjlhkcbbebagiadphdfipdki', primary: true },
        { label: 'Documentation', url: 'https://docs.vectored.dev/lens/', primary: false }
      ]
    },
    timesheets: {
      title: 'TimeSheets for Jira',
      platform: 'Atlassian Jira App',
      icon: 'assets/projects/timesheets_icon.png',
      images: [
        'assets/projects/timesheets/1.png',
        'assets/projects/timesheets/2.png',
        'assets/projects/timesheets/3.png'
      ],
      badge: 'Coming Soon',
      badgeClass: 'badge-soon',
      tagline: 'Enterprise time tracking, multi-tier approvals, and hierarchical cost centers.',
      description:
        'Modern time management tailored for enterprise engineering governance. Log hours directly against issues or hierarchical cost-centers, submit for project lead approvals, lock past reporting periods, and synchronize seamlessly with Jira native worklogs.',
      features: [
        'Hierarchical cost center tracking & issue allocation',
        'Multi-stage approval workflows for team leads',
        'Leave management, statutory holidays & team capacity',
        'Locking mechanisms for audited financial periods',
        'Two-way sync with native Jira worklogs',
        'Exportable executive timesheet summaries'
      ],
      links: [
        { label: 'Explore Preview Docs', url: 'https://docs.vectored.dev/timesheets/', primary: true }
      ]
    },
    devopshub: {
      title: 'DevOps Hub',
      platform: 'Microsoft Teams Enterprise App',
      icon: 'assets/images/bt_logo.png',
      images: [
        'assets/projects/devopshub/1.png',
        'assets/projects/devopshub/2.png',
        'assets/projects/devopshub/3.png'
      ],
      badge: 'Enterprise Production',
      badgeClass: 'badge-live',
      tagline: 'Centralized developer self-service bot & portal for 10k+ enterprise users at BT Group.',
      description:
        'Architected and built a mission-critical Microsoft Teams application standardizing access requests, permission audits, CI/CD pipeline triggers, pull request oversight, and automated platform governance across multiple developer services.',
      features: [
        'Unified self-service for developer access and role governance',
        'Automated CI/CD deployment triggers and health notifications',
        'Pull request review summaries & actionable notifications',
        'Integration with Jira, GitLab, GitHub Enterprise, and Jenkins',
        'Reduced manual ops requests by over 600,000 hours',
        'Enterprise OAuth2 and Active Directory / Entra ID sync'
      ],
      links: [
        { label: 'Read Career Details', url: '#experience', primary: true }
      ]
    }
  };

  // --- Theme Management ---
  const THEME_STORAGE_KEY = 'akshay_portfolio_theme';
  const themeToggleBtn = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
  }

  // Initialize Theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Sync with OS changes if user hasn't explicitly chosen
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Mobile Navigation Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function closeMobileNav() {
    if (navLinks && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      if (navBackdrop) {
        navBackdrop.classList.remove('active');
      }
      document.body.classList.remove('menu-open');
    }
  }

  function openMobileNav() {
    if (navLinks) {
      navLinks.classList.add('mobile-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      if (navBackdrop) {
        navBackdrop.classList.add('active');
      }
      document.body.classList.add('menu-open');
    }
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('mobile-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileNav();
      });
    });

    // Close mobile nav when clicking backdrop
    if (navBackdrop) {
      navBackdrop.addEventListener('click', function () {
        closeMobileNav();
      });
    }

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMobileNav();
      }
    });

    // Reset when resizing past mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMobileNav();
      }
    });
  }

  // --- Products Category Filter ---
  const filterButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      productCards.forEach(function (card) {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --- Project Details Modal Dialog & Screenshot Carousel ---
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const modalBrandImg = document.getElementById('modalBrandImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalPlatform = document.getElementById('modalPlatform');
  const modalBadge = document.getElementById('modalBadge');
  const modalDescription = document.getElementById('modalDescription');
  const modalFeatureList = document.getElementById('modalFeatureList');
  const modalActions = document.getElementById('modalActions');

  // Carousel Elements
  const carouselWrapper = document.getElementById('carouselWrapper');
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const carouselCounter = document.getElementById('carouselCounter');
  const carouselDots = document.getElementById('carouselDots');

  let currentSlides = [];
  let currentSlideIndex = 0;

  function goToSlide(index) {
    if (!currentSlides.length || !carouselTrack) return;
    currentSlideIndex = (index + currentSlides.length) % currentSlides.length;

    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === currentSlideIndex);
    });

    if (carouselDots) {
      const dots = carouselDots.querySelectorAll('.carousel-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlideIndex);
      });
    }

    if (carouselCounter) {
      carouselCounter.textContent = `${currentSlideIndex + 1} / ${currentSlides.length}`;
    }
  }

  function setupCarousel(images, projectTitle) {
    if (!carouselWrapper || !carouselTrack) return;

    carouselTrack.innerHTML = '';
    if (carouselDots) carouselDots.innerHTML = '';

    currentSlides = Array.isArray(images) ? images.filter(Boolean) : [];
    currentSlideIndex = 0;

    if (currentSlides.length === 0) {
      carouselWrapper.style.display = 'none';
      return;
    }

    carouselWrapper.style.display = 'block';

    currentSlides.forEach(function (src, idx) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide' + (idx === 0 ? ' active' : '');
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${projectTitle} Screenshot ${idx + 1}`;
      img.loading = 'lazy';
      slide.appendChild(img);
      carouselTrack.appendChild(slide);

      if (carouselDots && currentSlides.length > 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `View screenshot ${idx + 1}`);
        dot.addEventListener('click', function () {
          goToSlide(idx);
        });
        carouselDots.appendChild(dot);
      }
    });

    const hasMultiple = currentSlides.length > 1;
    if (carouselPrev) carouselPrev.style.display = hasMultiple ? 'flex' : 'none';
    if (carouselNext) carouselNext.style.display = hasMultiple ? 'flex' : 'none';
    if (carouselCounter) {
      carouselCounter.style.display = hasMultiple ? 'block' : 'none';
      carouselCounter.textContent = `1 / ${currentSlides.length}`;
    }
    if (carouselDots) {
      carouselDots.style.display = hasMultiple ? 'flex' : 'none';
    }
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      goToSlide(currentSlideIndex - 1);
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener('click', function (e) {
      e.stopPropagation();
      goToSlide(currentSlideIndex + 1);
    });
  }

  function openProjectModal(key) {
    const data = PROJECT_DATA[key];
    if (!data || !modalOverlay) return;

    modalBrandImg.src = data.icon;
    modalBrandImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalPlatform.textContent = data.platform;
    modalBadge.textContent = data.badge;
    modalBadge.className = data.badgeClass;

    setupCarousel(data.images, data.title);

    modalDescription.textContent = data.description;

    // Features
    modalFeatureList.innerHTML = '';
    data.features.forEach(function (feat) {
      const li = document.createElement('li');
      li.textContent = feat;
      modalFeatureList.appendChild(li);
    });

    // Action links
    modalActions.innerHTML = '';
    data.links.forEach(function (lnk) {
      const a = document.createElement('a');
      a.href = lnk.url;
      a.target = lnk.url.startsWith('http') ? '_blank' : '_self';
      a.rel = 'noopener';
      a.className = lnk.primary ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
      a.innerHTML = `${lnk.label} &rarr;`;
      modalActions.appendChild(a);
    });

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach preview button clicks
  document.querySelectorAll('[data-modal-target]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetKey = this.getAttribute('data-modal-target');
      openProjectModal(targetKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  // Keyboard navigation for modal & carousel cycling
  document.addEventListener('keydown', function (e) {
    if (!modalOverlay || !modalOverlay.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeProjectModal();
    } else if (e.key === 'ArrowLeft') {
      goToSlide(currentSlideIndex - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentSlideIndex + 1);
    }
  });

  // Mobile swipe support on carousel stage
  let touchStartX = 0;
  let touchEndX = 0;
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    carouselTrack.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            goToSlide(currentSlideIndex + 1);
          } else {
            goToSlide(currentSlideIndex - 1);
          }
        }
      }
    }, { passive: true });
  }

  // --- Copy Email to Clipboard Toast ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');

  function showToast(msg) {
    if (!toast) return;
    if (toastText) toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      const email = this.getAttribute('data-email') || 'akshaykg@vectored.dev';
      navigator.clipboard.writeText(email).then(
        function () {
          showToast(`Copied ${email} to clipboard!`);
        },
        function () {
          showToast(`Email: ${email}`);
        }
      );
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // A fractional threshold scales with element height: 0.12 of the 668px
        // hero text block demanded 80px on screen, which is unreachable when the
        // portrait card pushes it to within 44px of the fold on a phone. Trigger
        // on any intersection instead so tall blocks are not penalised.
        threshold: 0,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Anything already within the first screen must never start blank, whatever
    // the observer decides - the reveal is a flourish, not a gate on content.
    revealElements.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('active');
        revealObserver.unobserve(el);
      }
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('active');
    });
  }

  // --- Active Nav Link on Scroll ---
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];

  navAnchorLinks.forEach(function (a) {
    const id = a.getAttribute('href').substring(1);
    const sec = document.getElementById(id);
    if (sec) sections.push({ id, el: sec, link: a });
  });

  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (item) {
      const top = item.el.offsetTop;
      const height = item.el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchorLinks.forEach(l => l.classList.remove('active'));
        item.link.classList.add('active');
      }
    });
  }, { passive: true });

})();
