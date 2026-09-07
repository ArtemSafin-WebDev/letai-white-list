/** Custom select with a listbox in the top layer, clear of the dialog's scroll clipping. */
export function initCitySelect(root: HTMLElement, onChange: (value: string) => void) {
  const trigger = root.querySelector<HTMLButtonElement>('[data-city-select-trigger]')!;
  const label = root.querySelector<HTMLElement>('[data-city-select-label]')!;
  const list = root.querySelector<HTMLElement>('[data-city-select-options]')!;
  let options: readonly string[] = [];
  let value = '';
  let activeIndex = 0;
  let typeahead = '';
  let lastTypedAt = 0;
  const isOpen = () => list.matches(':popover-open');

  const close = () => {
    if (isOpen()) list.hidePopover();
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
  };
  const position = () => {
    const rect = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
    const below = bottom - rect.bottom - 16;
    const above = rect.top - (viewport?.offsetTop ?? 0) - 16;
    const openAbove = below < 180 && above > below;
    list.style.width = `${rect.width}px`;
    list.style.left = `${rect.left}px`;
    list.style.maxHeight = `${Math.max(48, Math.min(260, openAbove ? above : below))}px`;
    list.style.top = `${openAbove ? rect.top - list.offsetHeight - 6 : rect.bottom + 6}px`;
  };
  const highlight = (index: number) => {
    activeIndex = Math.max(0, Math.min(options.length - 1, index));
    [...list.children].forEach((option, i) => option.classList.toggle('is-active', i === activeIndex));
    const option = list.children[activeIndex] as HTMLElement | undefined;
    if (option) {
      trigger.setAttribute('aria-activedescendant', option.id);
      // Scroll the options only; the containing dialog stays in place.
      if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
      else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
        list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
      }
    }
  };
  const open = () => {
    if (trigger.disabled || !options.length) return;
    root.dispatchEvent(new CustomEvent('city-select-open', { bubbles: true }));
    list.showPopover();
    trigger.setAttribute('aria-expanded', 'true');
    position();
    highlight(Math.max(0, options.indexOf(value)));
  };
  const choose = (index: number) => {
    value = options[index];
    label.textContent = value;
    trigger.classList.add('has-value');
    [...list.children].forEach((option, i) => option.setAttribute('aria-selected', String(i === index)));
    close();
    trigger.focus({ preventScroll: true });
    onChange(value);
  };
  const setOptions = (nextOptions: readonly string[], placeholder: string) => {
    close();
    options = nextOptions;
    value = '';
    label.textContent = placeholder;
    trigger.classList.remove('has-value');
    trigger.disabled = !options.length;
    list.replaceChildren(...options.map((text, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'tv-city-select__option';
      option.id = `${list.id}-${index}`;
      option.tabIndex = -1;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.textContent = text;
      option.addEventListener('pointerdown', (event) => event.preventDefault());
      option.addEventListener('click', () => choose(index));
      return option;
    }));
  };

  trigger.addEventListener('click', () => isOpen() ? close() : open());
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      close();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const wasOpen = isOpen();
      if (!wasOpen) open();
      if (event.key === 'Home') highlight(0);
      else if (event.key === 'End') highlight(options.length - 1);
      else if (wasOpen) highlight(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
      else if (event.key === 'ArrowUp') highlight(options.length - 1);
    } else if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (isOpen()) choose(activeIndex);
      else open();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      if (!isOpen()) open();
      const now = Date.now();
      typeahead = now - lastTypedAt > 700 ? event.key : typeahead + event.key;
      lastTypedAt = now;
      const index = options.findIndex((option) => option.toLocaleLowerCase('ru').startsWith(typeahead.toLocaleLowerCase('ru')));
      if (index >= 0) highlight(index);
    }
  });
  document.addEventListener('city-select-open', (event) => { if (event.target !== root) close(); });
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && !root.contains(event.target)) close();
  });
  root.closest('dialog')?.addEventListener('close', close);
  root.closest('dialog')?.addEventListener('scroll', () => { if (isOpen()) position(); });
  window.addEventListener('resize', close);
  return { setOptions, get value() { return value; } };
}
