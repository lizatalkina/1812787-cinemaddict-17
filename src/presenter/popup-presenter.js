import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class PopupPresenter {
  init = (popupContainer, moviesModel) => {
    this.popupContainer = popupContainer;
    this.boardMovie = [...moviesModel.getMovies()][0];
    this.comments = [...moviesModel.getComments(this.boardMovie.id)];
    render(new PopupView(this.boardMovie, this.comments), popupContainer);
  };
}
