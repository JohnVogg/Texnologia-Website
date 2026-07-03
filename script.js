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

  // Tabs
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(name) {
    tabButtons.forEach(function (btn) {
      var isActive = btn.dataset.tab === name;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
    tabPanels.forEach(function (panel) {
      var isActive = panel.dataset.panel === name;
      panel.classList.toggle('is-active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(btn.dataset.tab);
    });
  });

  document.querySelectorAll('[data-tab-target]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      activateTab(link.dataset.tabTarget);
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Progress tracker
  var trackerList = document.getElementById('trackerList');
  var trackerFill = document.getElementById('trackerFill');
  var trackerPercent = document.getElementById('trackerPercent');

  if (trackerList) {
    var checkboxes = trackerList.querySelectorAll('input[type="checkbox"]');

    function updateTracker() {
      var total = checkboxes.length;
      var done = 0;
      checkboxes.forEach(function (cb) {
        var item = cb.closest('.tracker-item');
        item.classList.toggle('is-done', cb.checked);
        if (cb.checked) done++;
      });
      var pct = total ? Math.round((done / total) * 100) : 0;
      trackerFill.style.width = pct + '%';
      trackerPercent.textContent = pct + '%';
    }

    checkboxes.forEach(function (cb) {
      cb.addEventListener('change', updateTracker);
    });

    updateTracker();
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
