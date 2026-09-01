import Swiper from 'swiper';

const MOBILE_BREAKPOINT = '(max-width: 767px)';

function initTariffsSection(section: HTMLElement) {
  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-tariffs-tab]'));
  const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-tariffs-panel]'));
  const mobileQuery = window.matchMedia(MOBILE_BREAKPOINT);
  const swipers = new Map<HTMLElement, Swiper>();

  const syncSliders = () => {
    section.querySelectorAll<HTMLElement>('[data-tariffs-slider]').forEach((slider) => {
      const swiper = swipers.get(slider);

      if (mobileQuery.matches && !swiper) {
        swipers.set(
          slider,
          new Swiper(slider, {
            slidesPerView: 'auto',
            spaceBetween: 20,
            speed: 520,
            threshold: 6,
            grabCursor: true,
            watchOverflow: true,
            a11y: { enabled: true },
          }),
        );
      } else if (!mobileQuery.matches && swiper) {
        swiper.destroy(true, true);
        swipers.delete(slider);
      }
    });
  };

  const activateTab = (tab: HTMLButtonElement, moveFocus = false) => {
    const target = tab.dataset.tariffsTab;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tariffsPanel === target;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);

      if (isActive) {
        swipers.get(panel.querySelector<HTMLElement>('[data-tariffs-slider]')!)?.update();
      }
    });

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      let nextIndex = index;

      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      activateTab(tabs[nextIndex]!, true);
    });
  });

  syncSliders();
  mobileQuery.addEventListener('change', syncSliders);
}

export function initTariffs() {
  document.querySelectorAll<HTMLElement>('[data-tariffs]').forEach(initTariffsSection);
}
