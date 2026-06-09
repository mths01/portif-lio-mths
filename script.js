/* ═══════════════════════════════════════════════════════════
   MTHS FILMS — Slide Carousel Engine
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM Elements ──
  const wrapper      = document.getElementById('slidesWrapper');
  const slides       = wrapper.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const keyHint      = document.getElementById('keyboardHint');

  const totalSlides  = slides.length;
  let currentIndex   = 0;
  let isAnimating    = false;
  const ANIM_DURATION = 800; // ms

  // ── Initialize Background Images ──
  slides.forEach(slide => {
    const bgSrc = slide.getAttribute('data-bg');
    if (bgSrc) {
      const bgEl = slide.querySelector('.slide-bg-image');
      if (bgEl) {
        bgEl.style.backgroundImage = `url('${bgSrc}')`;
      }
    }
  });

  // ── Create Dots ──
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('slide-dot');
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.slide-dot');

  // ── Create Slide Counter ──
  const counter = document.createElement('div');
  counter.classList.add('slide-counter');
  document.body.appendChild(counter);

  // ── Create Ambient Glow ──
  const glow1 = document.createElement('div');
  glow1.classList.add('ambient-glow', 'glow-1');
  document.body.appendChild(glow1);

  const glow2 = document.createElement('div');
  glow2.classList.add('ambient-glow', 'glow-2');
  document.body.appendChild(glow2);

  // ── Core Navigation ──
  function goToSlide(index) {
    if (isAnimating || index === currentIndex || index < 0 || index >= totalSlides) return;

    isAnimating = true;
    
    // Remove active from current
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    // Set new index
    currentIndex = index;

    // Activate new slide
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');

    // Update counter
    updateCounter();

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Release animation lock
    setTimeout(() => {
      isAnimating = false;
    }, ANIM_DURATION);
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  function updateCounter() {
    const curr = String(currentIndex + 1).padStart(2, '0');
    const total = String(totalSlides).padStart(2, '0');
    counter.innerHTML = `<span class="current">${curr}</span><span class="separator">/</span><span>${total}</span>`;
  }

  // ── Initialize First Slide ──
  slides[0].classList.add('active');
  dots[0].classList.add('active');
  prevBtn.disabled = true;
  updateCounter();

  // ── Button Events ──
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // ── Keyboard Navigation ──
  let keyHintTimeout;

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextSlide();
        hideKeyHint();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevSlide();
        hideKeyHint();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  });

  function hideKeyHint() {
    if (keyHint && !keyHint.classList.contains('hidden')) {
      keyHint.classList.add('hidden');
    }
  }

  // Auto-hide keyboard hint after 5s
  keyHintTimeout = setTimeout(() => {
    hideKeyHint();
  }, 5000);

  // ── Mouse Wheel Navigation ──
  let wheelCooldown = false;

  document.addEventListener('wheel', (e) => {
    if (wheelCooldown) return;

    wheelCooldown = true;

    if (e.deltaY > 0) {
      nextSlide();
    } else if (e.deltaY < 0) {
      prevSlide();
    }

    setTimeout(() => {
      wheelCooldown = false;
    }, 1000);
  }, { passive: true });

  // ── Touch / Swipe Navigation ──
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const SWIPE_THRESHOLD = 50;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Determine if horizontal or vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > SWIPE_THRESHOLD) {
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  }

  // ── Preload Images ──
  slides.forEach(slide => {
    const bgSrc = slide.getAttribute('data-bg');
    if (bgSrc) {
      const img = new Image();
      img.src = bgSrc;
    }
  });

})();
