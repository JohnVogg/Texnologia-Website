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
