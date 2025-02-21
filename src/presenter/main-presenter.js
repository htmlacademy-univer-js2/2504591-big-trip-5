import { render } from '../render';
import { getRandomInteger } from '../utls';
import CreateForm from '../view/create-form-view';
import EditForm from '../view/edit-form-view';
import Point from '../view/point-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class MainPresenter{
  constructor(container, model){
    const tripEventsList = document.createElement('ul');
    tripEventsList.className = 'trip-events__list';
    container.appendChild(tripEventsList);
    this.container = tripEventsList;
    this.pointModel = model;
  }

  init(){
    this.pointModel.points = [...this.pointModel.getPoints()];
    this.pointModel.offers = [...this.pointModel.getOffers()];
    this.pointModel.destinations = [...this.pointModel.getDestinations()];
    render(new EditForm(this.pointModel,getRandomInteger(this.pointModel.points.length - 1)),this.container);
    render(new CreateForm(),this.container);
    for(let i = 1; i < this.pointModel.points.length; i++){
      render(new Point(this.pointModel,i),this.container);
    }
    flatpickr('#event-start-time-1', {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });

    flatpickr('#event-end-time-1', {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
    });
  }
}

