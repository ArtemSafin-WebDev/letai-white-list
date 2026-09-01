export function initMobileMenu() {
  const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const menuCloseButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');
  const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const mobileMenuPanel = document.querySelector<HTMLElement>('[data-mobile-menu-panel]');

  if (!menuButton || !menuCloseButton || !mobileMenu || !mobileMenuPanel) return;

  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  let lastFocusedElement: HTMLElement | null = null;
  let focusTimer: number | undefined;

  const getFocusableElements = () =>
    Array.from(
      mobileMenuPanel.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true');

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!mobileMenu.classList.contains('is-open')) return;

    window.clearTimeout(focusTimer);
    document.documentElement.classList.remove('menu-open');

    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');

    if (restoreFocus) {
      lastFocusedElement?.focus();
    }
  };

  const openMenu = () => {
    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.documentElement.classList.add('menu-open');

    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Закрыть меню');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('is-open');

    focusTimer = window.setTimeout(() => {
      if (mobileMenu.classList.contains('is-open')) {
        getFocusableElements()[0]?.focus({ preventScroll: true });
      }
    }, 0);
  };

  menuButton.addEventListener('click', openMenu);
  menuCloseButton.addEventListener('click', () => closeMenu());

  mobileMenu.addEventListener('pointerdown', (event) => {
    if (event.target === mobileMenu) {
      closeMenu();
    }
  });

  mobileMenuPanel.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu({ restoreFocus: false });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!mobileMenu.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  });

  mobileBreakpoint.addEventListener('change', (event) => {
    if (!event.matches) {
      closeMenu({ restoreFocus: false });
    }
  });
}
