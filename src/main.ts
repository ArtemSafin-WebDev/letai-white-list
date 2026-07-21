import '@fontsource-variable/roboto-flex/full.css';
import './styles/main.scss';
import { initServicesCatalog } from './services-catalog';

const accordionButtons = document.querySelectorAll<HTMLButtonElement>(
  '[data-accordion-button]',
);

accordionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const accordion = button.closest<HTMLElement>('[data-accordion]');
    if (!accordion) return;

    const isOpen = accordion.classList.toggle('is-open');
    const content = accordion.querySelector<HTMLElement>('[data-accordion-content]');

    button.setAttribute('aria-expanded', String(isOpen));
    content?.setAttribute('aria-hidden', String(!isOpen));
  });
});

function initMobileMenu() {
  const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  const mobileMenuPanel = document.querySelector<HTMLElement>('[data-mobile-menu-panel]');

  if (!menuButton || !mobileMenu || !mobileMenuPanel) return;

  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  let scrollPosition = 0;
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
    document.documentElement.style.removeProperty('--scroll-lock-offset');
    document.documentElement.style.removeProperty('--scrollbar-compensation');

    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');
    window.scrollTo(0, scrollPosition);

    if (restoreFocus) {
      lastFocusedElement?.focus();
    }
  };

  const openMenu = () => {
    scrollPosition = window.scrollY;
    lastFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.setProperty(
      '--scroll-lock-offset',
      `${-scrollPosition}px`,
    );
    document.documentElement.style.setProperty(
      '--scrollbar-compensation',
      `${scrollbarWidth}px`,
    );
    document.documentElement.classList.add('menu-open');

    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Закрыть меню');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('is-open');

    focusTimer = window.setTimeout(() => {
      if (mobileMenu.classList.contains('is-open')) {
        getFocusableElements()[0]?.focus();
      }
    }, 260);
  };

  menuButton.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

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

initMobileMenu();
initServicesCatalog();
