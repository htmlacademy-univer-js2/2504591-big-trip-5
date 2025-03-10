import { render } from './framework/render.js';
import Sort from './view/sort-view.js';
import Filter from './view/filter-view.js';
import MainPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';


const siteHeaderFiltersElement = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
render(new Filter(), siteHeaderFiltersElement);
render(new Sort(),siteBodySortElement);
const mainPresenter = new MainPresenter(siteBodySortElement,
  new PointModel(),new OfferModel(), new DestinationModel());
mainPresenter.init();

