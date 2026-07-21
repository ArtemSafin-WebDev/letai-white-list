type ServiceLink = {
  label: string;
  url: string;
};

type ServiceItem = string | ServiceLink;

type ServiceGroup = {
  category: string;
  name: string;
  description: string;
  services: ServiceItem[];
};

const CATEGORY_ORDER = [
  'Все',
  'Связь',
  'Госуслуги',
  'Доставка',
  'Финансы',
  'Поиск и карты',
  'Соцсети',
  'Маркетплейсы',
  'Транспорт',
  'СМИ',
  'Медицина',
  'Образование',
  'Общество',
  'Сервисы',
] as const;

const SERVICES: ServiceGroup[] = [
  {
    category: 'Связь',
    name: 'Летай / Таттелеком',
    description: 'Сайты, личный кабинет и мобильные приложения',
    services: [
      { label: 'letai.ru', url: 'https://letai.ru/' },
      { label: 'b2b.tattelecom.ru', url: 'https://b2b.tattelecom.ru/' },
      { label: 'my.tattelecom.ru', url: 'https://my.tattelecom.ru/' },
      { label: 'Личный кабинет', url: 'https://newlk.letai.ru/' },
      { label: 'Приложение «Летай 2.0»', url: '#app-letai' },
      { label: 'Приложение «Мой дом Летай»', url: '#app-mydom' },
    ],
  },
  {
    category: 'Связь',
    name: 'Мобильные операторы',
    description: 'Сайты и приложения операторов связи',
    services: [
      'МТС',
      'МегаФон / Yota',
      'билайн',
      'Т2',
      'СберМобайл',
      'СИМ-Телеком',
    ],
  },
  {
    category: 'Госуслуги',
    name: 'Госуслуги и ЕСИА',
    description: 'Авторизация, госуслуги, ДЭГ и выборы',
    services: ['Госуслуги', 'ЕСИА', 'Госвеб', 'Госключ'],
  },
  {
    category: 'Госуслуги',
    name: 'Государственные органы',
    description: 'Официальные сайты ведомств и порталы власти',
    services: ['МВД', 'МИД', 'МЧС', 'ФНС', 'Казначейство', 'ЦБ РФ', 'Росгвардия'],
  },
  {
    category: 'Госуслуги',
    name: 'ГИС и ЖКХ',
    description: 'Государственные информационные системы',
    services: ['ГИС ЖКХ', 'ГИС ГМП', 'ГИС ТОР КНД', 'ЕРКНМ', 'bus.gov.ru', 'ЕИС Закупки'],
  },
  {
    category: 'Госуслуги',
    name: 'Региональные порталы',
    description: 'Порталы правительств и МФЦ субъектов РФ',
    services: [
      'РПГУ регионов',
      'МФЦ Мои документы',
      'Мос.ру / ДИТ',
      'СПб Госуслуги',
      'Региональные сайты',
    ],
  },
  {
    category: 'Финансы',
    name: 'Банки и платежи',
    description: 'Интернет-банки, мобильные банки, эквайринг, СБП',
    services: ['ВТБ', 'Альфа-Банк', 'ПСБ', 'Газпромбанк', 'НСПК Мир', 'Финуслуги', 'Мосбиржа'],
  },
  {
    category: 'Поиск и карты',
    name: 'Яндекс',
    description: 'Поиск, навигация, такси, доставка и сервисы',
    services: ['Яндекс Go', 'Карты', 'Навигатор', 'Еда / Лавка', 'Заправки', 'Браузер', 'Яндекс ID'],
  },
  {
    category: 'Поиск и карты',
    name: '2ГИС',
    description: 'Карты, справочник, отзывы и API',
    services: ['2ГИС', 'Отелло', 'Фламп'],
  },
  {
    category: 'Поиск и карты',
    name: 'ГЛОНАСС и геоданные',
    description: 'Спутниковая навигация и мониторинг',
    services: ['ЭРА-ГЛОНАСС', 'Картография OSM', 'Gismeteo'],
  },
  {
    category: 'Соцсети',
    name: 'VK и платформы',
    description: 'Соцсети, видео, мессенджеры и пользовательский контент',
    services: ['ВКонтакте', 'Одноклассники', 'MAX', 'Mail.ru', 'Дзен', 'Rutube', 'RuStore', 'VK Видео'],
  },
  {
    category: 'Маркетплейсы',
    name: 'Онлайн-магазины',
    description: 'Маркетплейсы и сервисы объявлений',
    services: ['Ozon', 'Wildberries', 'Авито', 'МегаМаркет', 'Сайт Покупок', 'food.ru'],
  },
  {
    category: 'Маркетплейсы',
    name: 'Продуктовые сети',
    description: 'Сети магазинов и доставка продуктов',
    services: [
      'X5 (Пятёрочка/Перекрёсток)',
      'Магнит',
      'Лента',
      'METRO',
      'ВкусВилл',
      'АШАН',
      "О'КЕЙ",
      'Азбука вкуса',
      'Дикси',
      'СПАР',
    ],
  },
  {
    category: 'Доставка',
    name: 'Доставка и логистика',
    description: 'Курьерская доставка, посылки, продукты',
    services: ['Почта России', 'СДЭК', 'Деловые линии', 'Достависта', 'Самокат', 'Купер', 'Детский мир'],
  },
  {
    category: 'Доставка',
    name: 'Рестораны и фастфуд',
    description: 'Заказ еды и доставка из ресторанов',
    services: ['Додо Пицца', 'Burger King', 'Вкусно — и точка'],
  },
  {
    category: 'Транспорт',
    name: 'Поезда и авиа',
    description: 'Билеты, расписания, поездки',
    services: ['РЖД', 'Туту.ру', 'Аэрофлот', 'Победа', 'Гранд Сервис Экспресс'],
  },
  {
    category: 'Транспорт',
    name: 'Такси и каршеринг',
    description: 'Заказ такси и аренда авто',
    services: ['Яндекс Go', 'Такси Максим', 'Такси Анжи', 'ULTAXI', 'Делимобиль', 'Ситидрайв', 'BelkaCar'],
  },
  {
    category: 'Транспорт',
    name: 'Транспортные карты',
    description: 'Оплата проезда и городской транспорт',
    services: ['Транспортная карта', 'Карты жителя регионов', 'Умный транспорт', 'Парковки'],
  },
  {
    category: 'СМИ',
    name: 'Информагентства и СМИ',
    description: 'Новости, информагентства, печатные издания',
    services: [
      'РИА',
      'ТАСС',
      'РБК',
      'Коммерсантъ',
      'Известия',
      'Лента.ру',
      'Газета.ру',
      'КП',
      'АиФ',
      'Ведомости',
      'Российская газета',
      'МК',
      'Парламентская газета',
    ],
  },
  {
    category: 'СМИ',
    name: 'Телеканалы и видео',
    description: 'Сайты телеканалов и видеоплатформы',
    services: [
      'Первый канал',
      'Пятый канал',
      'НТВ',
      'ТНТ',
      'СТС',
      'ТВ3',
      'Матч ТВ',
      'RT',
      'Мир',
      'ВГТРК Смотрим',
      'Иви',
      'Okko',
      'Wink',
      'Premier',
      'KION',
      'МТС Live',
    ],
  },
  {
    category: 'СМИ',
    name: 'Радио',
    description: 'Радиоплееры и онлайн-вещание',
    services: ['Индустриальный радиоплеер', 'Лайм HD TV'],
  },
  {
    category: 'Медицина',
    name: 'Медицина и телемедицина',
    description: 'Запись к врачу, телемедицина, медицинские системы',
    services: ['Медси SmartMed', 'Мать и дитя', 'Портал пациента', 'Запись к врачу', 'Телемедицина', 'СМП регионов'],
  },
  {
    category: 'Образование',
    name: 'Образование',
    description: 'Электронные дневники и образовательные платформы',
    services: ['Дневник.ру', 'Сетевой город', 'Электронная школа', 'Учи.ру', 'МЭШ', 'Электронный колледж'],
  },
  {
    category: 'Общество',
    name: 'Общественные проекты',
    description: 'Волонтёрство, просвещение, добрые дела',
    services: ['Добро.РФ', 'РО Знание', 'Движение первых', 'Народный фронт', 'Лиза Алерт', 'Всё для Победы'],
  },
  {
    category: 'Сервисы',
    name: 'Работа и HR',
    description: 'Поиск работы, кадровые сервисы',
    services: ['hh.ru', 'Талантикс', 'Сетка', 'HRlink'],
  },
  {
    category: 'Сервисы',
    name: 'ИТ и облака',
    description: 'Облачные платформы, ВКС, безопасность',
    services: ['Yandex Cloud', 'TrueConf', 'Truconf', 'Лаборатория Касперского', 'РУВИКИ', 'ЦРПТ Честный знак'],
  },
  {
    category: 'Сервисы',
    name: 'Кассы и ОФД',
    description: 'Онлайн-кассы и фискальные данные',
    services: ['Эвотор', 'Платформа ОФД', 'СБП', 'Контур'],
  },
  {
    category: 'Сервисы',
    name: 'Энергетика и ЖКХ',
    description: 'Энергосбыт, газ, сети, зарядные станции',
    services: ['Россети', 'Мосгаз', 'НЭСК / ЭЗС', 'Ситроникс Electro'],
  },
  {
    category: 'Сервисы',
    name: 'Авто и охрана',
    description: 'Мониторинг, охрана, телематика',
    services: ['СтарЛайн', 'Цезарь Сателлит', 'Цезарь Позишен'],
  },
  {
    category: 'Сервисы',
    name: 'Стройка и ремонт',
    description: 'Стройматериалы и услуги',
    services: ['Петрович', 'Торнадо'],
  },
];

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replace(/[«»"'“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getServiceLabel = (service: ServiceItem) =>
  typeof service === 'string' ? service : service.label;

const isServiceLink = (service: ServiceItem): service is ServiceLink =>
  typeof service !== 'string';

export function initServicesCatalog() {
  const section = document.querySelector<HTMLElement>('.services-catalog');
  const categoryTrack = section?.querySelector<HTMLElement>('[data-category-track]');
  const categoryViewport = section?.querySelector<HTMLElement>(
    '[data-category-viewport]',
  );
  const categoryNavigation = section?.querySelector<HTMLElement>(
    '.services-catalog__navigation',
  );
  const previousButton = section?.querySelector<HTMLButtonElement>(
    '[data-category-prev]',
  );
  const nextButton = section?.querySelector<HTMLButtonElement>(
    '[data-category-next]',
  );
  const searchInput = section?.querySelector<HTMLInputElement>(
    '[data-service-search]',
  );
  const searchClear = section?.querySelector<HTMLButtonElement>(
    '[data-service-search-clear]',
  );
  const grid = section?.querySelector<HTMLElement>('[data-service-grid]');
  const expandButton = section?.querySelector<HTMLButtonElement>(
    '[data-service-expand]',
  );

  if (
    !section ||
    !categoryTrack ||
    !categoryViewport ||
    !categoryNavigation ||
    !previousButton ||
    !nextButton ||
    !searchInput ||
    !searchClear ||
    !grid ||
    !expandButton
  ) {
    return;
  }

  const mobileLayout = window.matchMedia('(max-width: 767px)');
  let activeCategory = 'Все';
  let query = '';
  let isExpanded = false;
  let areMobileCategoriesExpanded = false;

  const appendHighlightedText = (target: HTMLElement, text: string) => {
    const term = query.trim();
    const normalizedTerm = term.toLocaleLowerCase('ru');
    const normalizedText = text.toLocaleLowerCase('ru');

    if (!normalizedTerm || !normalizedText.includes(normalizedTerm)) {
      target.textContent = text;
      return;
    }

    let cursor = 0;
    let matchIndex = normalizedText.indexOf(normalizedTerm);

    while (matchIndex >= 0) {
      target.append(document.createTextNode(text.slice(cursor, matchIndex)));

      const mark = document.createElement('mark');
      mark.textContent = text.slice(matchIndex, matchIndex + term.length);
      target.append(mark);

      cursor = matchIndex + term.length;
      matchIndex = normalizedText.indexOf(normalizedTerm, cursor);
    }

    target.append(document.createTextNode(text.slice(cursor)));
  };

  const getFilteredServices = () => {
    const normalizedQuery = normalize(query);

    return SERVICES.filter((serviceGroup) => {
      if (
        activeCategory !== 'Все' &&
        serviceGroup.category !== activeCategory
      ) {
        return false;
      }

      if (!normalizedQuery) return true;

      const searchableValue = normalize(
        [
          serviceGroup.category,
          serviceGroup.name,
          serviceGroup.description,
          ...serviceGroup.services.map(getServiceLabel),
        ].join(' '),
      );

      return searchableValue.includes(normalizedQuery);
    });
  };

  const updateCategoryButtons = () => {
    categoryTrack
      .querySelectorAll<HTMLButtonElement>('[data-category]')
      .forEach((button) => {
        const isActive = button.dataset.category === activeCategory;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
  };

  const updateCategoryScrollState = () => {
    if (mobileLayout.matches) {
      categoryNavigation.dataset.canScrollLeft = 'false';
      categoryNavigation.dataset.canScrollRight = 'false';
      previousButton.disabled = true;
      nextButton.disabled = true;
      return;
    }

    const maxScroll =
      categoryViewport.scrollWidth - categoryViewport.clientWidth;
    const canScrollLeft = categoryViewport.scrollLeft > 1;
    const canScrollRight = categoryViewport.scrollLeft < maxScroll - 1;

    categoryNavigation.dataset.canScrollLeft = String(canScrollLeft);
    categoryNavigation.dataset.canScrollRight = String(canScrollRight);

    previousButton.disabled = !canScrollLeft;
    nextButton.disabled = !canScrollRight;
  };

  const createServiceCard = (serviceGroup: ServiceGroup, index: number) => {
    const card = document.createElement('article');
    card.className = 'services-catalog__card';
    card.style.animationDelay = `${Math.min(index, 7) * 28}ms`;

    if (serviceGroup.services.length >= 7) {
      card.classList.add('services-catalog__card--dense');
    }

    const title = document.createElement('h3');
    title.className = 'services-catalog__card-title';
    appendHighlightedText(title, serviceGroup.name);

    const description = document.createElement('p');
    description.className = 'services-catalog__card-description';
    appendHighlightedText(description, serviceGroup.description);

    const serviceList = document.createElement('div');
    serviceList.className = 'services-catalog__service-list';

    serviceGroup.services.forEach((service) => {
      const serviceElement = document.createElement(
        isServiceLink(service) ? 'a' : 'span',
      );
      serviceElement.className = 'services-catalog__service-item';
      appendHighlightedText(serviceElement, getServiceLabel(service));

      if (isServiceLink(service) && serviceElement instanceof HTMLAnchorElement) {
        serviceElement.href = service.url;

        if (service.url.startsWith('http')) {
          serviceElement.target = '_blank';
          serviceElement.rel = 'noopener';
        }
      }

      serviceList.append(serviceElement);
    });

    card.append(title, description, serviceList);
    return card;
  };

  const renderCards = () => {
    const filteredServices = getFilteredServices();
    const showAllCards = mobileLayout.matches || isExpanded;
    const visibleServices = showAllCards
      ? filteredServices
      : filteredServices.slice(0, 8);

    grid.setAttribute('aria-busy', 'true');
    grid.replaceChildren();

    if (visibleServices.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'services-catalog__empty';
      emptyState.textContent =
        'Ничего не найдено. Попробуйте другой запрос или сбросьте фильтр.';
      grid.append(emptyState);
    } else {
      visibleServices.forEach((serviceGroup, index) => {
        grid.append(createServiceCard(serviceGroup, index));
      });
    }

    const canExpand = !mobileLayout.matches && filteredServices.length > 8;
    expandButton.hidden = !canExpand;
    expandButton.setAttribute('aria-expanded', String(isExpanded));
    expandButton.setAttribute(
      'aria-label',
      isExpanded ? 'Свернуть список сервисов' : 'Показать все сервисы',
    );
    grid.setAttribute('aria-busy', 'false');
  };

  const renderCategories = () => {
    categoryTrack.replaceChildren();

    const visibleCategories =
      mobileLayout.matches && !areMobileCategoriesExpanded
        ? CATEGORY_ORDER.slice(0, 8)
        : CATEGORY_ORDER;

    visibleCategories.forEach((category) => {
      const button = document.createElement('button');
      button.className = 'services-catalog__category';
      button.type = 'button';
      button.dataset.category = category;
      button.textContent = category;
      button.setAttribute('aria-pressed', String(category === activeCategory));

      button.addEventListener('click', () => {
        activeCategory = category;
        isExpanded = false;
        updateCategoryButtons();
        renderCards();
      });

      categoryTrack.append(button);
    });

    if (mobileLayout.matches && !areMobileCategoriesExpanded) {
      const showAllButton = document.createElement('button');
      const showAllIcon = document.createElement('img');

      showAllButton.className = 'services-catalog__category-toggle';
      showAllButton.type = 'button';
      showAllButton.setAttribute('aria-label', 'Показать все категории');
      showAllButton.setAttribute('aria-expanded', 'false');

      showAllIcon.src = '/assets/services-arrow-next.svg';
      showAllIcon.width = 24;
      showAllIcon.height = 24;
      showAllIcon.alt = '';

      showAllButton.append(showAllIcon);
      showAllButton.addEventListener('click', () => {
        areMobileCategoriesExpanded = true;
        renderCategories();
      });
      categoryTrack.append(showAllButton);
    }

    requestAnimationFrame(updateCategoryScrollState);
  };

  const scrollCategories = (direction: -1 | 1) => {
    const distance = mobileLayout.matches
      ? categoryViewport.clientWidth
      : Math.max(250, categoryViewport.clientWidth * 0.72);

    categoryViewport.scrollBy({
      left: direction * distance,
      behavior: 'smooth',
    });
  };

  previousButton.addEventListener('click', () => scrollCategories(-1));
  nextButton.addEventListener('click', () => scrollCategories(1));
  categoryViewport.addEventListener('scroll', updateCategoryScrollState, {
    passive: true,
  });

  searchInput.addEventListener('input', () => {
    query = searchInput.value;
    isExpanded = false;
    searchClear.hidden = query.length === 0;
    renderCards();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    query = '';
    isExpanded = false;
    searchClear.hidden = true;
    renderCards();
    searchInput.focus();
  });

  expandButton.addEventListener('click', () => {
    isExpanded = !isExpanded;
    renderCards();
  });

  mobileLayout.addEventListener('change', () => {
    categoryViewport.scrollTo({ left: 0 });
    isExpanded = false;
    areMobileCategoriesExpanded = false;
    renderCategories();
    renderCards();
  });

  window.addEventListener('resize', updateCategoryScrollState, {
    passive: true,
  });

  renderCategories();
  renderCards();
}
