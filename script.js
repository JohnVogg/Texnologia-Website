(function () {
  'use strict';

  // Mobile nav toggle
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navbar.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navbar.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form validation
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    var formStatus = document.getElementById('formStatus');

    function setError(fieldId, hasError) {
      document.getElementById(fieldId).classList.toggle('has-error', hasError);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('contactName').value.trim();
      var email = document.getElementById('contactEmail').value.trim();
      var message = document.getElementById('contactMessage').value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      var nameValid = name.length > 0;
      var emailValid = emailPattern.test(email);
      var messageValid = message.length >= 10;

      setError('field-name', !nameValid);
      setError('field-email', !emailValid);
      setError('field-message', !messageValid);

      if (!nameValid || !emailValid || !messageValid) {
        formStatus.textContent = 'Έλεγξε τα πεδία με κόκκινο και δοκίμασε ξανά.';
        formStatus.classList.add('is-visible');
        return;
      }

      formStatus.textContent = 'Ευχαριστούμε, ' + name + '! Αυτή είναι demo φόρμα — δεν στέλνεται πραγματικό μήνυμα ακόμα.';
      formStatus.classList.add('is-visible');
      contactForm.reset();
    });
  }

  // Media carousels (Podcast + Videos)
  function initMediaCarousel(trackId, prevId, nextId) {
    var track = document.getElementById(trackId);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);

    if (!track || !prevBtn || !nextBtn) return;

    var slides = track.querySelectorAll('.media-slide');
    var slideCount = slides.length;
    var currentSlide = 0;

    function updateCarousel() {
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
      prevBtn.disabled = currentSlide === 0;
      nextBtn.disabled = currentSlide === slideCount - 1;
    }

    prevBtn.addEventListener('click', function () {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', function () {
      if (currentSlide < slideCount - 1) {
        currentSlide++;
        updateCarousel();
      }
    });

    var touchStartX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) < 40) return;
      if (deltaX < 0 && currentSlide < slideCount - 1) {
        currentSlide++;
      } else if (deltaX > 0 && currentSlide > 0) {
        currentSlide--;
      }
      updateCarousel();
    }, { passive: true });

    updateCarousel();

    track.querySelectorAll('.media-video').forEach(function (videoEl) {
      var playBtn = videoEl.querySelector('.media-play');
      playBtn.addEventListener('click', function () {
        var videoId = videoEl.getAttribute('data-video-id');
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
        iframe.title = 'YouTube video player';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        videoEl.innerHTML = '';
        videoEl.appendChild(iframe);
      });
    });
  }

  initMediaCarousel('podcastTrack', 'podcastPrev', 'podcastNext');

  // Newsletter form (demo only)
  var newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('newsletterEmail');
      var email = emailInput.value.trim();
      if (!email) return;
      emailInput.value = '';
      emailInput.placeholder = 'Ευχαριστούμε! (demo)';
    });
  }
})();
