import {render} from './render.js';
import Sort from './view/sort-view.js';
import Filter from './view/filter-view.js';
import MainPresenter from './presenter/main-presenter.js';
import PointModel from './model/point-model.js';

const siteHeaderFiltersElement = document.querySelector('.trip-controls__filters');
const siteBodySortElement = document.querySelector('.trip-events');
render(new Filter(), siteHeaderFiltersElement);
render(new Sort(),siteBodySortElement);
const mainPresenter = new MainPresenter(siteBodySortElement, new PointModel());
mainPresenter.init();

