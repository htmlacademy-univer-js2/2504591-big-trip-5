import { mockDestinations } from '../mock/destination';

export default class DestinationModel{
  #destinations = mockDestinations;

  getDestinations(){
    return this.#destinations;
  }

  getDestinationById(id){
    return this.#destinations.find((item)=>item.id === id);
  }
}
