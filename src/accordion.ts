export function initAccordions() {
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
}
