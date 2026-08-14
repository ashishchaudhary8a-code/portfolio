/**
 * ASHISH KUNTAL — PORTFOLIO CLIENT ENGINE
 * Handles interactive sparrow dynamics, project filtering, ambient cursor lighting,
 * and contact interactions.
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

  // 3. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 4. Active Navigation Observer
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

  // 5. Interactive Project Filtering
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
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Direct Email Copy to Clipboard Interaction
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
        // Fallback: trigger mailto
        window.location.href = `mailto:${emailToCopy}`;
      }
    });
  }

  // 7. Interactive Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const formStatusMsg = document.getElementById('formStatusMsg');

  if (contactForm && formSubmitBtn && formStatusMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      const subject = document.getElementById('formSubject')?.value.trim();
      const message = document.getElementById('formMessage')?.value.trim();

      if (!name || !email || !message) {
        formStatusMsg.textContent = 'Please fill out all required fields.';
        formStatusMsg.className = 'form-status-msg';
        formStatusMsg.style.display = 'block';
        formStatusMsg.style.background = 'rgba(239, 68, 68, 0.15)';
        formStatusMsg.style.borderColor = '#ef4444';
        formStatusMsg.style.color = '#fca5a5';
        return;
      }

      // Simulate instantaneous submission state
      const originalBtnHtml = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = '<span>Transmitting...</span>';
      formSubmitBtn.disabled = true;

      setTimeout(() => {
        formSubmitBtn.innerHTML = '<span>✓ Message Sent!</span>';
        formSubmitBtn.style.background = '#22c55e';
        formSubmitBtn.style.color = '#070709';

        formStatusMsg.textContent = `Thank you, ${name}! Your message has been sent directly to Ashish Kuntal. I will get back to you shortly.`;
        formStatusMsg.className = 'form-status-msg success';

        contactForm.reset();

        setTimeout(() => {
          formSubmitBtn.innerHTML = originalBtnHtml;
          formSubmitBtn.style.background = '';
          formSubmitBtn.style.color = '';
          formSubmitBtn.disabled = false;
        }, 4000);
      }, 700);
    });
  }

  // 8. Dynamic Copyright Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 9. Neural Pulse Tooltip & Interactive Highlight
  const neuralPulses = document.querySelectorAll('.neural-pulse');
  neuralPulses.forEach(pulse => {
    pulse.addEventListener('mouseenter', () => {
      const tooltip = pulse.getAttribute('data-tooltip');
      if (tooltip) {
        pulse.style.transform = 'scale(1.35)';
      }
    });
    pulse.addEventListener('mouseleave', () => {
      pulse.style.transform = 'scale(1)';
    });
  });

  // 10. Interactive Sparrow Nudge on Brand Hover
  const brandLogo = document.getElementById('navBrandLogo');
  const sparrowFlyer = document.getElementById('sparrowFlyer');
  if (brandLogo && sparrowFlyer) {
    brandLogo.addEventListener('mouseenter', () => {
      sparrowFlyer.style.animationDuration = '1.8s';
    });
    brandLogo.addEventListener('mouseleave', () => {
      sparrowFlyer.style.animationDuration = '3.8s';
    });
  }
});
