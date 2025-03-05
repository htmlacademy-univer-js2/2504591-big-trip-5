import { mockPoints } from '../mock/point';

export default class PointModel{
  #points = mockPoints;

  getPoints(){
    return this.#points;
  }
}
