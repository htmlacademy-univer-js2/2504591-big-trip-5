import PointPresenter from './point-presenter';
import { render, RenderPosition, remove } from '../framework/render';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import { sortPointByDay, sortPointByTime } from '../utils/utls';
import { filter } from '../utils/filter.js';
import EmptyListView from '../view/empty-list-view';
import SortView from '../view/sort-view';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class MainPresenter {
  #pointModel;
  #offerModel;
  #destinationModel;
  #filterModel;
  #bigContainer;
  #listContainer;
  #newPointPresenter;
  #pointsPresenters = new Map();
  #sortComponent = null;
  #actualSortType = SortType.DAY;
  #loadingComponent = new LoadingView();
  #isLoading = true;

  constructor(container, pointModel, offerModel, destinationModel, filterModel, onNewPointDestroy) {
    const tripEventsList = document.createElement('ul');
    tripEventsList.className = 'trip-events__list';
    container.appendChild(tripEventsList);
    this.#bigContainer = container;
    this.#listContainer = tripEventsList;

    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#destinationModel = destinationModel;

    this.#pointModel.addObserver(this.#onModelEvent);
    this.#offerModel.addObserver(this.#onModelEvent);
    this.#destinationModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);

    this.#newPointPresenter = new NewPointPresenter(
      tripEventsList,
      this.#onViewAction,
      onNewPointDestroy
    );
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[filterType](points);
    switch (this.#actualSortType) {
      case SortType.DAY:
        filteredPoints.sort(sortPointByDay);
        break;
      case SortType.TIME:
        filteredPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;
    }
    return filteredPoints;
  }

  get offerModel() {
    return this.#offerModel;
  }

  get destinationModel() {
    return this.#destinationModel;
  }

  init() {
    this.#renderPoints();
  }

  createPoint = () => {
    this.#actualSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#offerModel, this.#destinationModel);
  };

  #onSortTypeChange = (changeSortType) => {
    if (changeSortType === this.#actualSortType) {
      return;
    }
    this.#actualSortType = changeSortType;
    this.#clearPointList({ resetRenderedPointCount: true });
    this.#renderPoints();

  };

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent); // Удаляем старый компонент [[1]]
    }
    this.#sortComponent = new SortView({ currentSortType: this.#actualSortType, onSortTypeChange: this.#onSortTypeChange });
    render(this.#sortComponent, this.#bigContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoints() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const pointsCount = this.points.length;
    if (pointsCount === 0) {
      render(new EmptyListView(this.#filterModel.filter), this.#listContainer, RenderPosition.AFTEREND);
      return;
    }
    this.#renderSort();
    for (let i = 0; i < pointsCount; i++) {
      const pointPresenter = new PointPresenter(
        this.container,
        this.offerModel,
        this.destinationModel,
        this.#onViewAction,
        this.#onModeChange);
      pointPresenter.init(this.points[i]);
      this.#pointsPresenters.set(this.points[i].id, pointPresenter);
    }
  }

  #clearPointList({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (resetSortType) {
      this.#actualSortType = SortType.DAY;
    }
  }

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoints(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoints(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoints(updateType, update);
        break;
    }
  };

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #onModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({ resetRenderedPointCount: true, resetSortType: true });
        this.#renderPoints();
        break;
      case UpdateType.INIT:
        if (this.#pointModel.isLoaded && this.#offerModel.isLoaded && this.#destinationModel.isLoaded) {
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderPoints();
        }
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  get container() {
    return this.#listContainer;
  }
}

