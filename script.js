/**
 * ASHISH KUNTAL — PORTFOLIO CLIENT ENGINE
 * Handles realistic forward-flying avian dynamics, interactive project architecture modals,
 * category filtering, ambient lighting, and contact interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambient Cursor Lighting Glow
  const ambientCursor = document.getElementById('ambientCursor');
  if (ambientCursor && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      ambientCursor.style.left = `${currentX}px`;
      ambientCursor.style.top = `${currentY}px`;
      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);
  }

  // 2. Sticky Header Glass Morph on Scroll
  const siteHeader = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 5. Active Navigation Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  // 6. Interactive Project Filtering (Comugle, RAG Pipeline, Offline Tourist)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Interactive System Architecture Modals
  const openModalBtns = document.querySelectorAll('.btn-open-arch-modal');
  const modalOverlays = document.querySelectorAll('.arch-modal-overlay');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('open');
      targetModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock scroll
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scroll
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.arch-modal-overlay');
      closeModal(modal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close on Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        if (overlay.classList.contains('open')) {
          closeModal(overlay);
        }
      });
    }
  });

  // 8. Direct Email Copy to Clipboard Interaction
  const contactEmailBtn = document.getElementById('contactEmailBtn');
  const copyBadge = document.getElementById('copyBadge');
  const emailDisplay = document.getElementById('emailAddressDisplay');

  if (contactEmailBtn && copyBadge && emailDisplay) {
    const emailToCopy = emailDisplay.textContent.trim();

    contactEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        const originalText = copyBadge.innerHTML;
        copyBadge.innerHTML = '<span>✓ Copied!</span>';
        copyBadge.classList.add('copied');

        setTimeout(() => {
          copyBadge.innerHTML = originalText;
          copyBadge.classList.remove('copied');
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${emailToCopy}`;
      }
    });
  }

  // 9. Dynamic Copyright Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 11. Neural Pulse Tooltip
  const neuralPulses = document.querySelectorAll('.neural-pulse');
  neuralPulses.forEach(pulse => {
    pulse.addEventListener('mouseenter', () => {
      pulse.style.transform = 'scale(1.35)';
    });
    pulse.addEventListener('mouseleave', () => {
      pulse.style.transform = 'scale(1)';
    });
  });

  // 12. Interactive Avian Speed Boost on Brand Hover
  const brandLogo = document.getElementById('navBrandLogo');
  const navAvianFlyer = document.getElementById('navAvianFlyer');
  if (brandLogo && navAvianFlyer) {
    brandLogo.addEventListener('mouseenter', () => {
      navAvianFlyer.style.filter = 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.8))';
    });
    brandLogo.addEventListener('mouseleave', () => {
      navAvianFlyer.style.filter = 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.35))';
    });
  }
});

