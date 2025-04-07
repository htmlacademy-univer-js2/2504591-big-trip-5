import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';
import { render, RenderPosition } from '../framework/render';
import SortView from '../view/sort-view';
import { SortType } from '../const';
import { sortPointByDay, sortPointByTime } from '../utils/utls';

export default class MainPresenter{
  #pointModel;
  #offerModel;
  #destinationModel;
  #container;
  #listPoints = [];
  #pointsPresenters = new Map();
  #sortComponent = null;
  #actualSortType = SortType.DAY;

  constructor(container, pointModel,offerModel,destinationModel){
    const tripEventsList = document.createElement('ul');
    tripEventsList.className = 'trip-events__list';
    container.appendChild(tripEventsList);
    this.#container = tripEventsList;
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
  }

  init(){
    this.#renderSort();
    this.#listPoints = [...this.#pointModel.points];
    this.#renderPointsList();
    flatpickr('#event-start-time-1', {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });

    flatpickr('#event-end-time-1', {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });

  }

  #handleSortTypeChange = (changeSortType) => {
    if(changeSortType !== this.#actualSortType){
      switch(changeSortType){
        case SortType.DAY:
          this.#listPoints.sort(sortPointByDay);
          break;
        case SortType.TIME:
          this.#listPoints.sort(sortPointByTime);
          break;
        case SortType.PRICE:
          this.#listPoints.sort((a,b)=>b.basePrice - a.basePrice);
          break;
      }
      this.#actualSortType = changeSortType;
      this.#clearPointsList();
      this.#renderPointsList();
    }
  };

  #renderSort(){
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent,this.#container,RenderPosition.AFTERBEGIN);
  }

  #renderPointsList(){
    for(let i = 0; i < this.#listPoints.length; i++){
      const pointPresenter = new PointPresenter(this.container,this.offerModel,
        this.destinationModel,this.#handlePointChange,this.#onModeChange);
      pointPresenter.init(this.#listPoints[i]);
      this.#pointsPresenters.set(this.#listPoints[i].id,pointPresenter);
    }
  }

  #clearPointsList(){
    this.#pointsPresenters.forEach((pointPresenter)=>pointPresenter.destroy());
    this.#pointsPresenters.clear();
  }

  #handlePointChange = (updatePoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatePoint);
    this.#pointsPresenters.get(updatePoint.id).init(updatePoint);
  };

  #onModeChange = () =>{
    this.#pointsPresenters.forEach((pointPresenter)=>pointPresenter.resetView());
  };

  get pointModel(){
    return this.#pointModel;
  }

  get offerModel(){
    return this.#offerModel;
  }

  get destinationModel(){
    return this.#destinationModel;
  }

  get container(){
    return this.#container;
  }
}

