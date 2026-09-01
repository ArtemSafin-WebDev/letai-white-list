const NAME_PATTERN = /^[\p{L}\s'’-]+$/u;

type LeadResponse = {
  status?: string;
  data?: {
    errorCode?: string;
  };
  errors?: Array<{
    code?: string;
    message?: string;
    customData?: {
      csrf?: string;
    };
  }>;
};

type CallbackWindow = Window & {
  BX?: {
    bitrix_sessid?: () => string;
  };
  LETAI_CALLBACK_FORM_ENDPOINT?: string;
};

function getNationalPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('7') || digits.startsWith('8')) {
    return digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

function formatPhone(value: string) {
  const digits = getNationalPhoneDigits(value);
  const groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  let formatted = '+ 7';

  if (groups[0]) formatted += ` ${groups[0]}`;
  if (groups[1]) formatted += ` ${groups[1]}`;
  if (groups[2]) formatted += `-${groups[2]}`;
  if (groups[3]) formatted += `-${groups[3]}`;

  return formatted;
}

function createSuccessModal() {
  const modal = document.querySelector<HTMLElement>('[data-callback-success-modal]');
  const dialog = modal?.querySelector<HTMLElement>('[data-callback-success-dialog]');
  const closeButton = modal?.querySelector<HTMLButtonElement>('[data-callback-success-close]');

  if (!modal || !dialog || !closeButton) return null;

  let lastFocusedElement: HTMLElement | null = null;

  const close = () => {
    if (!modal.classList.contains('is-open')) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('callback-success-modal-open');

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  const open = (trigger: HTMLElement) => {
    lastFocusedElement = trigger;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('callback-success-modal-open');
    window.setTimeout(() => closeButton.focus({ preventScroll: true }), 0);
  };

  closeButton.addEventListener('click', close);
  modal.addEventListener('pointerdown', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus({ preventScroll: true });
    }
  });

  return { open };
}

function getLeadError(result: LeadResponse) {
  if (
    result.status !== 'error' &&
    !result.data?.errorCode &&
    !result.errors?.length
  ) {
    return '';
  }

  return result.errors?.[0]?.message || result.data?.errorCode || 'Lead rejected';
}

async function sendCallbackLead(form: HTMLFormElement) {
  const callbackWindow = window as CallbackWindow;
  const endpoint = callbackWindow.LETAI_CALLBACK_FORM_ENDPOINT || form.action;
  const sessid = callbackWindow.BX?.bitrix_sessid?.() || '';
  const payload = new URLSearchParams();
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    if (typeof value === 'string') payload.append(key, value);
  });

  const firstname = formData.get('firstname');
  const phone = formData.get('phone');

  if (typeof firstname === 'string') payload.set('post[firstname]', firstname.trim());
  if (typeof phone === 'string') payload.set('post[phone]', phone);
  if (sessid) payload.set('sessid', sessid);
  payload.set('post[formId]', '.default');
  payload.set('post[param_referer]', document.title);
  payload.set('post[currentUrl]', window.location.href);

  const request = async (csrfToken: string) => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    if (csrfToken) headers['X-Bitrix-Csrf-Token'] = csrfToken;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: payload,
      headers,
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<LeadResponse>;
  };

  let result = await request(sessid);
  const csrfError = result.errors?.find((error) => error.code === 'invalid_csrf');
  const refreshedCsrf = csrfError?.customData?.csrf;

  if (refreshedCsrf) result = await request(refreshedCsrf);

  const errorMessage = getLeadError(result);
  if (errorMessage) throw new Error(errorMessage);
}

function initCallbackForm(
  form: HTMLFormElement,
  successModal: ReturnType<typeof createSuccessModal>,
) {
  const nameInput = form.querySelector<HTMLInputElement>('[data-callback-name]');
  const phoneInput = form.querySelector<HTMLInputElement>('[data-callback-phone]');
  const nameError = form.querySelector<HTMLElement>('[data-callback-error="name"]');
  const phoneError = form.querySelector<HTMLElement>('[data-callback-error="phone"]');
  const submitButton = form.querySelector<HTMLButtonElement>('[data-callback-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-callback-submit-label]');
  const submitError = form.querySelector<HTMLElement>('[data-callback-submit-error]');

  if (
    !nameInput ||
    !phoneInput ||
    !nameError ||
    !phoneError ||
    !submitButton ||
    !submitLabel ||
    !submitError ||
    !successModal
  ) {
    return;
  }

  const setError = (input: HTMLInputElement, error: HTMLElement, message: string) => {
    input.setAttribute('aria-invalid', String(Boolean(message)));
    input.closest('.callback-form__field')?.classList.toggle('has-error', Boolean(message));
    error.textContent = message;
  };

  const validateName = () => {
    const value = nameInput.value.trim();
    let message = '';

    if (!value) {
      message = 'Введите имя';
    } else if (value.length < 2 || !NAME_PATTERN.test(value)) {
      message = 'Проверьте имя';
    }

    setError(nameInput, nameError, message);
    return !message;
  };

  const validatePhone = () => {
    const isValid = getNationalPhoneDigits(phoneInput.value).length === 10;
    setError(phoneInput, phoneError, isValid ? '' : 'Введите номер полностью');
    return isValid;
  };

  nameInput.addEventListener('blur', validateName);
  nameInput.addEventListener('input', () => {
    if (nameInput.getAttribute('aria-invalid') === 'true') validateName();
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
    if (phoneInput.getAttribute('aria-invalid') === 'true') validatePhone();
  });
  phoneInput.addEventListener('blur', () => {
    if (!getNationalPhoneDigits(phoneInput.value).length) phoneInput.value = '';
    validatePhone();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitError.hidden = true;
    submitError.textContent = '';

    const isNameValid = validateName();
    const isPhoneValid = validatePhone();

    if (!isNameValid || !isPhoneValid) {
      form.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus({ preventScroll: true });
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = 'Отправляем…';
    form.setAttribute('aria-busy', 'true');

    try {
      await sendCallbackLead(form);
      form.reset();
      setError(nameInput, nameError, '');
      setError(phoneInput, phoneError, '');
      successModal.open(submitButton);
    } catch (error) {
      console.error('Callback form submission failed', error);
      submitError.textContent =
        'Не удалось отправить заявку. Попробуйте ещё раз или позвоните по номеру (843) 222-22-22.';
      submitError.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = 'Жду звонка';
      form.removeAttribute('aria-busy');
    }
  });
}

export function initCallbackForms() {
  const successModal = createSuccessModal();

  document
    .querySelectorAll<HTMLFormElement>('[data-callback-form]')
    .forEach((form) => initCallbackForm(form, successModal));

  document.querySelectorAll<HTMLElement>('[data-callback-section]').forEach((section) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    section.classList.add('is-enhanced');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        section.classList.add('is-visible');
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
  });
}
