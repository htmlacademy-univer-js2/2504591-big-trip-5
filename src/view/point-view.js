import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeString, getDurationTime, humanizeDate } from '../utls.js';

function createPointsTemplate(pointModel,offerModel,destinationModel){
  const {
    base_price: price,
    date_from: dateFrom,
    date_to: dateTo,
    destination: destinationId,
    is_favorite: isFavorite,
    offers: offersId,
    type
  } = pointModel;

  const pointOffers = [];
  for(const offerId of offersId){
    pointOffers.push(offerModel.getOfferById(type,offerId));
  }
  const {name} = destinationModel.getDestinationById(destinationId);
  const date = humanizeDate(dateFrom);
  return `
            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${humanizeDate(dateFrom,'YYYY-MM-DDTHH:mm')}">${date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${capitalizeString(type)} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${humanizeDate(dateFrom,'YYYY-MM-DDTHH:mm')}">${humanizeDate(dateFrom,'HH:mm')}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${humanizeDate(dateTo,'YYYY-MM-DDTHH:mm')}">${humanizeDate(dateTo,'HH:mm')}</time>
                  </p>
                  <p class="event__duration">${getDurationTime(dateFrom,dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${pointOffers.map((offer) =>`
                    <li class="event__offer">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offer.price}</span>
                    </li>
                  `).join('')}
                </ul>
                <button class="event__favorite-btn ${isFavorite && 'event__favorite-btn--active'}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>
`;
}

export default class Point extends AbstractView{
  #pointModel;
  #offerModel;
  #destinationModel;
  #rollupButton;

  constructor(pointModel,offerModel,destinationModel,onButtonClick){
    super();
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#rollupButton.addEventListener('click',onButtonClick);
  }

  get template(){
    return createPointsTemplate(this.#pointModel,this.#offerModel,this.#destinationModel);
  }
}
