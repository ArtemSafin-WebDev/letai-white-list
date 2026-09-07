import { TV_CITIES, TV_DISTRICTS } from './tv-locations';
import { initCitySelect } from './city-select';

/** Initializes the independent TV header, disclosures and native modal dialogs. */
export function initTvHeader() {
  const header = document.querySelector<HTMLElement>('[data-tv-header]');
  const menu = document.querySelector<HTMLDialogElement>('[data-tv-menu]');
  const cityDialog = document.querySelector<HTMLDialogElement>('[data-tv-city-dialog]');
  const searchDialog = document.querySelector<HTMLDialogElement>('[data-tv-search-dialog]');
  if (!header || !menu || !cityDialog || !searchDialog) return;

  const dialogs = [menu, cityDialog, searchDialog];
  const menuTrigger = header.querySelector<HTMLButtonElement>('[data-tv-menu-open]')!;
  const mobile = window.matchMedia('(max-width: 767px)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const disclosures = [...document.querySelectorAll<HTMLDetailsElement>('[data-tv-dropdown]')];
  const cityList = cityDialog.querySelector<HTMLElement>('[data-tv-cities]')!;
  const districtValue = cityDialog.querySelector<HTMLInputElement>('[data-tv-city-district-value]')!;
  const settlementValue = cityDialog.querySelector<HTMLInputElement>('[data-tv-city-settlement-value]')!;
  const searchInput = searchDialog.querySelector<HTMLInputElement>('[data-tv-search-input]')!;
  const searchResults = searchDialog.querySelector<HTMLElement>('[data-tv-search-results]')!;
  const selectedCity = header.querySelector('[data-tv-city-name]')?.textContent?.trim();

  const syncDialogState = () => {
    document.documentElement.classList.toggle('tv-header-dialog-open', dialogs.some((dialog) => dialog.open));
    menuTrigger.setAttribute('aria-expanded', String(menu.open));
  };
  const openDialog = (dialog: HTMLDialogElement) => {
    if (!dialog.open) dialog.showModal();
    syncDialogState();
  };
  const closeDialog = (dialog: HTMLDialogElement) => {
    dialog.close();
    syncDialogState();
  };
  for (const dialog of dialogs) {
    dialog.addEventListener('close', syncDialogState);
    dialog.querySelector('[data-tv-dialog-close]')?.addEventListener('click', () => closeDialog(dialog));
    // Native dialogs trap focus, restore the trigger and close with Escape.
    let backdropPointerDown = false;
    const outside = (event: PointerEvent | MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', (event) => { backdropPointerDown = event.target === dialog && outside(event); });
    dialog.addEventListener('click', (event) => {
      if (backdropPointerDown && event.target === dialog && outside(event)) closeDialog(dialog);
      backdropPointerDown = false;
    });
  }

  menuTrigger.addEventListener('click', () => openDialog(menu));
  menu.querySelector('[data-tv-menu-close]')?.addEventListener('click', () => closeDialog(menu));
  mobile.addEventListener('change', () => {
    for (const dialog of [...dialogs].reverse()) closeDialog(dialog);
    for (const detail of disclosures) detail.open = false;
  });

  for (const detail of disclosures) {
    let leaveTimer: number | undefined;
    detail.querySelector('summary')?.addEventListener('click', (event) => {
      // Pointer hover has already opened the desktop disclosure before the click.
      if (!mobile.matches && hover.matches && event.detail > 0) {
        event.preventDefault();
        detail.open = true;
      }
    });
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      for (const other of disclosures) {
        if (other !== detail && other.parentElement === detail.parentElement) other.open = false;
      }
    });
    detail.addEventListener('pointerenter', () => {
      window.clearTimeout(leaveTimer);
      if (!mobile.matches && hover.matches) detail.open = true;
    });
    detail.addEventListener('pointerleave', () => {
      if (!mobile.matches && hover.matches) leaveTimer = window.setTimeout(() => {
        if (!detail.contains(document.activeElement)) detail.open = false;
      }, 150);
    });
    detail.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!mobile.matches && !detail.contains(document.activeElement)) detail.open = false;
      }, 0);
    });
  }
  document.addEventListener('click', (event) => {
    if (mobile.matches || !(event.target instanceof Node)) return;
    for (const detail of disclosures) if (!detail.contains(event.target)) detail.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || dialogs.some((dialog) => dialog.open)) return;
    const current = disclosures.find((detail) => detail.open && detail.contains(document.activeElement));
    for (const detail of disclosures) detail.open = false;
    current?.querySelector('summary')?.focus();
  });

  const renderCities = () => {
    cityList.replaceChildren(...TV_CITIES.map((city) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = city;
      button.setAttribute('aria-pressed', String(city === selectedCity));
      button.addEventListener('click', () => closeDialog(cityDialog));
      return button;
    }));
  };
  const settlementSelect = initCitySelect(cityDialog.querySelector<HTMLElement>('[data-tv-city-settlement]')!, (value) => {
    settlementValue.value = value;
  });
  const districtSelect = initCitySelect(cityDialog.querySelector<HTMLElement>('[data-tv-city-district]')!, () => renderSettlements());
  const renderSettlements = () => {
    const settlements = TV_DISTRICTS[districtSelect.value] ?? [];
    settlementSelect.setOptions(settlements, settlements.length ? 'Населённый пункт' : 'Выберите район');
    districtValue.value = districtSelect.value;
    settlementValue.value = '';
  };
  cityDialog.querySelector('form')!.addEventListener('submit', () => closeDialog(cityDialog));
  document.querySelectorAll('[data-tv-city-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      districtSelect.setOptions(Object.keys(TV_DISTRICTS), 'Район');
      renderSettlements();
      renderCities();
      openDialog(cityDialog);
    });
  });

  const searchLinks = [...menu.querySelectorAll<HTMLAnchorElement>('.tv-mobile-menu__nav a')];
  const renderSearch = () => {
    const query = searchInput.value.trim().toLocaleLowerCase('ru');
    const links = searchLinks.filter((link) => link.textContent?.toLocaleLowerCase('ru').includes(query));
    searchResults.replaceChildren(...links.map((link) => link.cloneNode(true)));
    searchDialog.querySelector<HTMLElement>('[data-tv-search-empty]')!.hidden = links.length > 0;
  };
  document.querySelectorAll('[data-tv-search-open]').forEach((trigger) => trigger.addEventListener('click', () => {
    searchInput.value = '';
    renderSearch();
    openDialog(searchDialog);
    searchInput.focus();
  }));
  searchInput.addEventListener('input', renderSearch);
  // Close overlays before same-page navigation and move focus to the destination.
  for (const surface of [header, menu, searchDialog]) {
    surface.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a') : null;
      if (!link) return;
      // Keep unconfigured links inert until their destination is supplied.
      if (link.getAttribute('href') === '') {
        event.preventDefault();
        return;
      }
      for (const dialog of [...dialogs].reverse()) if (dialog.open) closeDialog(dialog);
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      }
    });
  }
}
