/* ==========================================================================
   ASHISH KUNTAL — SENIOR FREELANCE DEVELOPER PORTFOLIO
   Script: Interactive Journey Path, Profile Picture Switcher & Micro-Interactions
   ========================================================================== */

(function () {
  'use strict';

  // --- DOM Elements ---
  const journeyRail = document.getElementById('journeyRail');
  const pathNodes = document.querySelectorAll('.path-node');
  const pathActiveFill = document.getElementById('pathActiveFill');
  const trajectoryStateTag = document.getElementById('trajectoryStateTag');
  const trajectoryCurrentHeading = document.getElementById('trajectoryCurrentHeading');
  const trajectoryNextText = document.getElementById('trajectoryNextText');
  const ambientSpotlight = document.getElementById('ambientSpotlight');
  const profileFrame = document.getElementById('profileFrame');
  const profileMainImage = document.getElementById('profileMainImage');
  const btnPhotoStudio = document.getElementById('btnPhotoStudio');
  const btnPhotoPortrait = document.getElementById('btnPhotoPortrait');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const stageSections = document.querySelectorAll('.stage-section');
  const navLinks = document.querySelectorAll('.nav-link');

  // --- State ---
  let activeSectionId = 'hero';
  let isTicking = false;

  // =========================================================================
  // 1. AMBIENT CURSOR SPOTLIGHT
  // =========================================================================
  if (ambientSpotlight && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateSpotlight = () => {
      // Smooth interpolation for buttery follow
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      ambientSpotlight.style.left = `${currentX}px`;
      ambientSpotlight.style.top = `${currentY}px`;
      requestAnimationFrame(updateSpotlight);
    };

    requestAnimationFrame(updateSpotlight);
  }

  // =========================================================================
  // 2. INTERACTIVE 3D CARD TILT ON HERO PROFILE
  // =========================================================================
  if (profileFrame && window.matchMedia('(pointer: fine)').matches) {
    const handleTilt = (e) => {
      const rect = profileFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7; // max 7 deg tilt
      const rotateY = ((x - centerX) / centerX) * 7;

      profileFrame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    };

    const resetTilt = () => {
      profileFrame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    };

    profileFrame.addEventListener('mousemove', handleTilt);
    profileFrame.addEventListener('mouseleave', resetTilt);
  }

  // =========================================================================
  // 3. PROFILE PICTURE SWITCHER (Studio Cutout vs Portrait Photo)
  // =========================================================================
  if (profileMainImage && btnPhotoStudio && btnPhotoPortrait) {
    const setProfilePhoto = (src, activeBtn, inactiveBtn) => {
      profileMainImage.style.opacity = '0.4';
      profileMainImage.style.transform = 'scale(0.96)';

      setTimeout(() => {
        profileMainImage.src = src;
        profileMainImage.style.opacity = '1';
        profileMainImage.style.transform = 'scale(1)';
        activeBtn.classList.add('is-active');
        inactiveBtn.classList.remove('is-active');
      }, 150);
    };

    btnPhotoStudio.addEventListener('click', () => {
      setProfilePhoto(btnPhotoStudio.dataset.src, btnPhotoStudio, btnPhotoPortrait);
    });

    btnPhotoPortrait.addEventListener('click', () => {
      setProfilePhoto(btnPhotoPortrait.dataset.src, btnPhotoPortrait, btnPhotoStudio);
    });
  }

  // =========================================================================
  // 4. LEFT-SIDE JOURNEY PATH RAIL TRACKING & CONTROLLER (Continuous Smooth Tracking)
  // =========================================================================
  const updateJourneyProgress = () => {
    if (!stageSections.length || !pathNodes.length || !pathActiveFill) return;

    const pathContainer = document.querySelector('.path-track-container');
    if (!pathContainer) return;

    const containerRect = pathContainer.getBoundingClientRect();
    const startY = containerRect.top + 20; // Top anchor of the vertical path line

    // Calculate vertical center of each waypoint bullet along the track
    const bulletCenters = [];
    pathNodes.forEach((node) => {
      const bullet = node.querySelector('.node-bullet');
      if (bullet) {
        const bulletRect = bullet.getBoundingClientRect();
        const center = bulletRect.top + (bulletRect.height / 2) - startY;
        bulletCenters.push(Math.max(0, center));
      } else {
        bulletCenters.push(0);
      }
    });

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    // Eye focus threshold is 35% down viewport
    const focusY = scrollY + (windowHeight * 0.35);

    const sectionTops = Array.from(stageSections).map((sec) => sec.offsetTop);
    const numSections = sectionTops.length;

    let targetLineHeight = bulletCenters[0] || 0;
    let activeIdx = 0;

    // Piecewise smooth continuous interpolation between consecutive sections
    if (focusY <= sectionTops[0]) {
      // At or above the first section (Hero)
      activeIdx = 0;
      targetLineHeight = bulletCenters[0] || 0;
    } else if (focusY >= sectionTops[numSections - 1]) {
      // At or below the final section (Contact)
      activeIdx = numSections - 1;
      targetLineHeight = bulletCenters[numSections - 1] || 0;
    } else {
      // Between section i and section i+1: smoothly interpolate pixel-by-pixel
      for (let i = 0; i < numSections - 1; i++) {
        const topCurrent = sectionTops[i];
        const topNext = sectionTops[i + 1];

        if (focusY >= topCurrent && focusY < topNext) {
          activeIdx = i;
          const ratio = (focusY - topCurrent) / (topNext - topCurrent);
          const yStart = bulletCenters[i];
          const yEnd = bulletCenters[i + 1];
          targetLineHeight = yStart + (ratio * (yEnd - yStart));
          break;
        }
      }
    }

    // Clamp line height
    const maxTrackHeight = bulletCenters[numSections - 1] || 0;
    targetLineHeight = Math.max(0, Math.min(targetLineHeight, maxTrackHeight));

    // Smoothly apply continuous line height (zero teleporting!)
    pathActiveFill.style.height = `${targetLineHeight.toFixed(2)}px`;

    // Station Glowing Logic:
    // A circle glows (is-reached) as soon as the line reaches or passes it.
    // When the user scrolls back UP and the line recedes above it, it stops glowing!
    pathNodes.forEach((node, idx) => {
      const nodeCenter = bulletCenters[idx];
      const hasReached = targetLineHeight >= (nodeCenter - 4);
      const isCurrentActive = idx === activeIdx;

      // Glow state: on when reached, off when scrolled back up
      if (hasReached) {
        node.classList.add('is-reached');
      } else {
        node.classList.remove('is-reached');
      }

      const nodeStatus = node.querySelector('.node-status');

      if (isCurrentActive) {
        node.classList.add('is-active');
        if (nodeStatus) nodeStatus.textContent = 'ACTIVE';
      } else {
        node.classList.remove('is-active');
        if (nodeStatus) {
          if (hasReached) {
            nodeStatus.textContent = 'PASSED';
          } else if (idx === activeIdx + 1) {
            nodeStatus.textContent = 'UP NEXT';
          } else {
            nodeStatus.textContent = 'QUEUED';
          }
        }
      }
    });

    // Update active section telemetry readouts (Smooth & Minimalist without Stage prefixes)
    const activeSection = stageSections[activeIdx];
    if (activeSection) {
      const currentId = activeSection.id;
      if (currentId !== activeSectionId) {
        activeSectionId = currentId;
        const sectionTitle = activeSection.getAttribute('data-stage-title') || 'OVERVIEW';
        const nextTarget = activeSection.getAttribute('data-next-stage') || 'NEXT SECTION';

        if (trajectoryStateTag) trajectoryStateTag.textContent = 'EXPLORING';
        if (trajectoryCurrentHeading) trajectoryCurrentHeading.textContent = sectionTitle;
        if (trajectoryNextText) trajectoryNextText.textContent = `Approaching: ${nextTarget}`;

        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    }
  };

  // On Scroll handler with requestAnimationFrame throttle
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        updateJourneyProgress();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Initial call on load
  window.addEventListener('DOMContentLoaded', () => {
    updateJourneyProgress();
  });
  window.addEventListener('resize', updateJourneyProgress);

  // =========================================================================
  // 5. SMOOTH CLICK-TO-SECTION NAVIGATION WITH PATH HIGHLIGHT
  // =========================================================================
  const allAnchors = document.querySelectorAll('a[href^="#"]');
  allAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        // Close mobile drawer if open
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileMenu();
        }

        // Tactile scroll
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Push state without hash jump
        if (history.pushState) {
          history.pushState(null, null, `#${targetId}`);
        }
      }
    });
  });

  // =========================================================================
  // 6. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const openMobileMenu = () => {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove('is-open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // Trigger initial calculation
  updateJourneyProgress();

})();

