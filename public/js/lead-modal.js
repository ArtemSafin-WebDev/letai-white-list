(function () {
  'use strict';

  var focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  var defaultEndpoint =
    '/bitrix/services/main/ajax.php?mode=class&c=tattelecom%3Aform&action=sendLead';
  var smartCaptchaSiteKey = 'ysc1_lcu3tXGbKwUv0jZbi5Hh1Km8iaq0LWkynZA7R7uB5dc09f9d';
  var isLocalDevelopment = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

  function loadSmartCaptcha() {
    if (window.smartCaptcha) return Promise.resolve(window.smartCaptcha);

    return new Promise(function (resolve, reject) {
      var existingScript = document.querySelector('script[data-lead-captcha-script]');

      function handleLoad() {
        if (window.smartCaptcha) {
          resolve(window.smartCaptcha);
        } else {
          reject(new Error('SmartCaptcha API is unavailable'));
        }
      }

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad, { once: true });
        existingScript.addEventListener(
          'error',
          function () {
            reject(new Error('SmartCaptcha failed to load'));
          },
          { once: true },
        );
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js?render=onload';
      script.async = true;
      script.defer = true;
      script.dataset.leadCaptchaScript = '';
      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener(
        'error',
        function () {
          reject(new Error('SmartCaptcha failed to load'));
        },
        { once: true },
      );
      document.head.append(script);
    });
  }

  function getPhoneDigits(value) {
    var digits = value.replace(/\D/g, '');

    if (digits.startsWith('7') || digits.startsWith('8')) {
      return digits.slice(1, 11);
    }

    return digits.slice(0, 10);
  }

  function initLeadModal() {
    var modal = document.querySelector('[data-lead-modal]');
    if (!modal) return;

    var dialog = modal.querySelector('[data-lead-modal-dialog]');
    var form = modal.querySelector('[data-lead-form]');
    var formView = modal.querySelector('[data-lead-form-view]');
    var successView = modal.querySelector('[data-lead-success]');
    var nameInput = modal.querySelector('[data-lead-name]');
    var phoneInput = modal.querySelector('[data-lead-phone]');
    var consentInput = modal.querySelector('[data-lead-consent]');
    var consentLabel = modal.querySelector('[data-lead-consent-label]');
    var submitButton = modal.querySelector('[data-lead-submit]');
    var submitLabel = modal.querySelector('[data-lead-submit-label]');
    var submitError = modal.querySelector('[data-lead-submit-error]');
    var captchaContainer = modal.querySelector('[data-lead-captcha]');
    var closeButton = modal.querySelector('.lead-modal__close');
    var openButtons = document.querySelectorAll('[data-lead-modal-open]');

    if (
      !dialog ||
      !form ||
      !formView ||
      !successView ||
      !nameInput ||
      !phoneInput ||
      !consentInput ||
      !consentLabel ||
      !submitButton ||
      !submitLabel ||
      !submitError ||
      !captchaContainer ||
      !closeButton ||
      !openButtons.length
    ) {
      return;
    }

    if (!window.Inputmask) {
      console.error('Inputmask 5.0.7 failed to load');
      return;
    }

    new window.Inputmask({ mask: '+7 (999) 999-99-99' }).mask(phoneInput);

    var errors = {
      name: modal.querySelector('[data-lead-error="name"]'),
      phone: modal.querySelector('[data-lead-error="phone"]'),
      consent: modal.querySelector('[data-lead-error="consent"]'),
    };

    var lastFocusedElement = null;
    var captchaWidgetId = null;
    var captchaReady = null;
    var resolveCaptchaToken = null;

    function setFieldError(input, errorElement, message) {
      input.setAttribute('aria-invalid', String(Boolean(message)));
      var field = input.closest('.lead-modal__field');
      if (field) field.classList.toggle('has-error', Boolean(message));
      if (errorElement) errorElement.textContent = message;
    }

    function validateName() {
      var isValid = nameInput.value.trim().length > 0;
      setFieldError(
        nameInput,
        errors.name,
        isValid ? '' : 'Заполните все обязательные поля',
      );
      return isValid;
    }

    function validatePhone() {
      var isValid = getPhoneDigits(phoneInput.value).length === 10;
      setFieldError(
        phoneInput,
        errors.phone,
        isValid ? '' : 'Заполните все обязательные поля',
      );
      return isValid;
    }

    function validateConsent() {
      var isValid = consentInput.checked;
      consentInput.setAttribute('aria-invalid', String(!isValid));
      consentLabel.classList.toggle('has-error', !isValid);
      if (errors.consent) {
        errors.consent.textContent = isValid ? '' : 'Заполните все обязательные поля';
      }
      return isValid;
    }

    function validateForm() {
      var isNameValid = validateName();
      var isPhoneValid = validatePhone();
      var isConsentValid = validateConsent();
      return isNameValid && isPhoneValid && isConsentValid;
    }

    function resetFormState() {
      form.reset();
      setFieldError(nameInput, errors.name, '');
      setFieldError(phoneInput, errors.phone, '');
      consentInput.setAttribute('aria-invalid', 'false');
      consentLabel.classList.remove('has-error');
      if (errors.consent) errors.consent.textContent = '';
      submitError.hidden = true;
      submitError.textContent = '';
      submitButton.disabled = false;
      submitLabel.textContent = 'Жду звонка';
      form.classList.remove('is-submitting');
      dialog.classList.remove('is-success');
      formView.hidden = false;
      successView.hidden = true;
      if (captchaWidgetId !== null && window.smartCaptcha && window.smartCaptcha.reset) {
        window.smartCaptcha.reset(captchaWidgetId);
      }
    }

    function getFocusableElements() {
      return Array.from(dialog.querySelectorAll(focusableSelector)).filter(function (element) {
        return element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true';
      });
    }

    function closeModal() {
      if (!modal.classList.contains('is-open')) return;

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('lead-modal-open');

      window.setTimeout(function () {
        if (!modal.classList.contains('is-open')) resetFormState();
      }, 220);

      if (lastFocusedElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus({ preventScroll: true });
      }
    }

    function openModal(trigger) {
      var mobileMenu = document.querySelector('[data-mobile-menu]');
      var openedFromMobileMenu = Boolean(trigger.closest('[data-mobile-menu]'));

      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        var menuCloseButton = document.querySelector('[data-menu-close]');
        if (menuCloseButton) menuCloseButton.click();
      }

      lastFocusedElement = openedFromMobileMenu
        ? document.querySelector('[data-menu-button]')
        : trigger;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('lead-modal-open');

      window.setTimeout(function () {
        var autofocusElement = modal.querySelector('[data-lead-modal-autofocus]');
        (autofocusElement || dialog).focus({ preventScroll: true });
      }, 0);
    }

    function showSuccess() {
      formView.hidden = true;
      successView.hidden = false;
      dialog.classList.add('is-success');
      closeButton.focus({ preventScroll: true });
    }

    function prepareCaptcha() {
      if (isLocalDevelopment || captchaWidgetId !== null) return Promise.resolve();
      if (captchaReady) return captchaReady;

      captchaReady = loadSmartCaptcha().then(function (captcha) {
        captchaWidgetId = captcha.render(captchaContainer, {
          sitekey: smartCaptchaSiteKey,
          hl: 'ru',
          invisible: true,
          hideShield: true,
          callback: function (token) {
            if (resolveCaptchaToken) resolveCaptchaToken(token);
            resolveCaptchaToken = null;
          },
        });
      });

      return captchaReady;
    }

    function getCaptchaToken() {
      if (isLocalDevelopment) return Promise.resolve('development');

      return prepareCaptcha().then(function () {
        if (captchaWidgetId === null || !window.smartCaptcha) {
          throw new Error('SmartCaptcha is unavailable');
        }

        return new Promise(function (resolve) {
          resolveCaptchaToken = resolve;
          window.smartCaptcha.execute(captchaWidgetId);
        });
      });
    }

    function sendLead(captchaToken) {
      var endpoint = window.LETAI_LEAD_FORM_ENDPOINT || form.action || defaultEndpoint;
      var payload = new URLSearchParams();
      var sessid = window.BX && window.BX.bitrix_sessid ? window.BX.bitrix_sessid() : '';

      if (sessid) payload.set('sessid', sessid);
      payload.set('post[firstname]', nameInput.value.trim());
      payload.set('post[phone]', phoneInput.value);
      payload.set('post[modal-callback-agree]', 'on');
      payload.set('post[smart-token]', captchaToken);
      payload.set('post[formId]', '.default');
      payload.set('post[param_referer]', document.title);
      payload.set('post[currentUrl]', window.location.href);

      function request(csrfToken) {
        var headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        };

        if (csrfToken) headers['X-Bitrix-Csrf-Token'] = csrfToken;

        return fetch(endpoint, {
          method: 'POST',
          body: payload,
          headers: headers,
          credentials: 'same-origin',
        }).then(function (response) {
          if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
          }
          return response.json();
        });
      }

      return request(sessid).then(function (result) {
        var csrfError = result.errors && result.errors.find(function (error) {
          return error.code === 'invalid_csrf';
        });
        var refreshedCsrf = csrfError && csrfError.customData && csrfError.customData.csrf;

        return refreshedCsrf ? request(refreshedCsrf) : result;
      }).then(function (result) {
        if (
          result.status === 'error' ||
          (result.data && result.data.errorCode) ||
          (result.errors && result.errors.length)
        ) {
          var message =
            (result.errors && result.errors[0] && result.errors[0].message) ||
            (result.data && result.data.errorCode) ||
            'Lead rejected';
          throw new Error(message);
        }
      });
    }

    openButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        openModal(button);
      });
    });

    modal.querySelectorAll('[data-lead-modal-close]').forEach(function (button) {
      button.addEventListener('click', closeModal);
    });

    modal.addEventListener('pointerdown', function (event) {
      if (event.target === modal) closeModal();
    });

    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', function () {
      if (nameInput.getAttribute('aria-invalid') === 'true') validateName();
    });

    phoneInput.addEventListener('input', function () {
      if (phoneInput.getAttribute('aria-invalid') === 'true') validatePhone();
    });
    phoneInput.addEventListener('blur', validatePhone);

    consentInput.addEventListener('change', validateConsent);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitError.hidden = true;

      if (!validateForm()) {
        var invalidField = form.querySelector('[aria-invalid="true"]');
        if (invalidField) invalidField.focus({ preventScroll: true });
        return;
      }

      submitButton.disabled = true;
      submitLabel.textContent = 'Отправляем…';
      form.classList.add('is-submitting');

      getCaptchaToken()
        .then(sendLead)
        .then(showSuccess)
        .catch(function (error) {
          console.error('Lead form submission failed', error);
          submitError.textContent =
            'Не удалось отправить заявку. Попробуйте ещё раз или позвоните по номеру (843) 222-22-22.';
          submitError.hidden = false;

          if (captchaWidgetId !== null && window.smartCaptcha && window.smartCaptcha.reset) {
            window.smartCaptcha.reset(captchaWidgetId);
          }
        })
        .finally(function () {
          submitButton.disabled = false;
          submitLabel.textContent = 'Жду звонка';
          form.classList.remove('is-submitting');
        });
    });

    document.addEventListener('keydown', function (event) {
      if (!modal.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== 'Tab') return;

      var focusableElements = getFocusableElements();
      var firstElement = focusableElements[0];
      var lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        if (lastElement) lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        if (firstElement) firstElement.focus();
      }
    });

    prepareCaptcha().catch(function () {
      // Ошибка загрузки будет показана пользователю только при попытке отправки.
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeadModal, { once: true });
  } else {
    initLeadModal();
  }
})();
