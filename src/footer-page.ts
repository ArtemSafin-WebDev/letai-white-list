import '@fontsource-variable/roboto-flex/full.css';
import './styles/main.scss';
import { initAccordions } from './accordion';
import { initCallbackForms } from './callback-form';
import './styles/components/_header-tv.scss';
import { initTvHeader } from './header-tv';
import { initTariffs } from './tariffs';

initTvHeader();
initAccordions();
initCallbackForms();
initTariffs();
