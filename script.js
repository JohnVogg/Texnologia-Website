(function () {
  'use strict';

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('navLinksMobile');

  if (navToggle && mobileMenu) {
    var toggleSpans = navToggle.querySelectorAll('span');

    function setMenuOpen(isOpen) {
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      toggleSpans[0].classList.toggle('rotate-45', isOpen);
      toggleSpans[0].classList.toggle('translate-y-1.5', isOpen);
      toggleSpans[1].classList.toggle('opacity-0', isOpen);
      toggleSpans[2].classList.toggle('-rotate-45', isOpen);
      toggleSpans[2].classList.toggle('-translate-y-1.5', isOpen);
    }

    navToggle.addEventListener('click', function () {
      setMenuOpen(mobileMenu.classList.contains('hidden'));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });
  }

  // Active nav link highlighting
  var navLinkEls = document.querySelectorAll('.nav-link');

  if (navLinkEls.length) {
    var setActiveNav = function (key) {
      navLinkEls.forEach(function (link) {
        var isActive = link.getAttribute('data-section') === key;
        link.classList.toggle('text-ink', isActive);
        link.classList.toggle('font-medium', isActive);
        link.classList.toggle('text-ink-2', !isActive);
      });
    };

    var currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'about.html') {
      setActiveNav('about');
    } else if (currentPage === 'portfolio.html') {
      setActiveNav('portfolio');
    } else {
      var spySections = ['podcast', 'templates', 'videos']
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

      if (spySections.length && 'IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveNav(entry.target.id);
            }
          });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

        spySections.forEach(function (section) {
          sectionObserver.observe(section);
        });
      }
    }
  }

  // Animated stat counters
  var statEls = document.querySelectorAll('.stat-value');

  if (statEls.length) {
    var statsAnimated = false;

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animateStat(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1200;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        el.textContent = prefix + Math.round(target * easeOutQuad(progress)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    function animateStats() {
      if (statsAnimated) return;
      statsAnimated = true;
      statEls.forEach(animateStat);
    }

    if ('IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });

      statsObserver.observe(statEls[0].parentElement.parentElement);
    } else {
      animateStats();
    }
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

  // Template download gate (email capture -> Google Sheet -> direct PDF download)
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiUfhyYrJIKHVBdAOuIf5rmFbU32M7J2P4YCCOPcBiTzp1P0ELSnWJtWNlFwvErhlH/exec';

  var TEMPLATE_FILES = {
    'beyond-code-guide': 'templates/beyond-code-guide.pdf',
    'backend-odigos': 'templates/backend-odigos.pdf',
    'praktiki-askisi-ellada-2026': 'templates/praktiki-askisi-ellada-2026.pdf',
  };

  var templateModal = document.getElementById('templateModal');

  if (templateModal) {
    var templateModalForm = document.getElementById('templateModalForm');
    var templateModalEmail = document.getElementById('templateModalEmail');
    var templateModalId = document.getElementById('templateModalId');
    var templateModalStatus = document.getElementById('templateModalStatus');
    var templateModalSubmit = document.getElementById('templateModalSubmit');
    var templateModalClose = document.getElementById('templateModalClose');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function openTemplateModal(templateId) {
      templateModalId.value = templateId;
      templateModalStatus.textContent = '';
      templateModal.classList.remove('hidden');
      templateModal.classList.add('flex');
      templateModalEmail.focus();
    }

    function closeTemplateModal() {
      templateModal.classList.add('hidden');
      templateModal.classList.remove('flex');
      templateModalForm.reset();
      templateModalStatus.textContent = '';
    }

    document.querySelectorAll('.template-download-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openTemplateModal(trigger.getAttribute('data-template-id'));
      });
    });

    templateModalClose.addEventListener('click', closeTemplateModal);

    templateModal.addEventListener('click', function (e) {
      if (e.target === templateModal) closeTemplateModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !templateModal.classList.contains('hidden')) closeTemplateModal();
    });

    templateModalForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = templateModalEmail.value.trim();
      var fileUrl = TEMPLATE_FILES[templateModalId.value];

      if (!emailPattern.test(email)) {
        templateModalStatus.textContent = 'Δώσε ένα έγκυρο email.';
        templateModalStatus.classList.add('text-red-600');
        return;
      }

      if (!fileUrl) {
        templateModalStatus.classList.add('text-red-600');
        templateModalStatus.textContent = 'Κάτι πήγε στραβά, δοκίμασε ξανά.';
        return;
      }

      templateModalStatus.classList.remove('text-red-600');
      templateModalStatus.textContent = 'Στέλνεται...';
      templateModalSubmit.disabled = true;

      fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: new FormData(templateModalForm) })
        .then(function () {
          templateModalStatus.textContent = 'Ευχαριστούμε! Η λήψη ξεκινάει...';

          var link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileUrl.split('/').pop();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(closeTemplateModal, 1200);
        })
        .catch(function () {
          templateModalStatus.classList.add('text-red-600');
          templateModalStatus.textContent = 'Κάτι πήγε στραβά, δοκίμασε ξανά.';
        })
        .finally(function () {
          templateModalSubmit.disabled = false;
        });
    });
  }

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
