import { UpdateType } from '../const';
import Observable from '../framework/observable';

export default class DestinationModel extends Observable {
  #destinations = [];
  #destinationsApiService;
  #isLoaded = false;

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
    this.#isLoaded = true;
    this._notify(UpdateType.INIT);
  }

  get destinations() {
    return this.#destinations;
  }

  get isLoaded() {
    return this.#isLoaded;
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id) || { name: '', description: '', pictures: [] };
  }
}
