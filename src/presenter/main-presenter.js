import { render } from '../render';
import CreateForm from '../view/create-form-view';
import EditForm from '../view/edit-form-view';
import Point from '../view/point-view';


export default class MainPresenter{
  constructor({container}){
    const tripEventsList = document.createElement('ul');
    tripEventsList.className = 'trip-events__list';
    container.appendChild(tripEventsList);
    this.container = tripEventsList;
  }

  init(){
    render(new EditForm(),this.container);
    render(new CreateForm(),this.container);
    for(let i = 0; i < 3; i++){
      render(new Point(),this.container);
    }
  }
}
