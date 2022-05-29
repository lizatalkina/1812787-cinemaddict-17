import PopupView from '../view/popup-view.js';
import {isEscapeKey} from '../utils/common.js';
import {render} from '../framework/render.js';

const closePopup = () => {
  const filmDetails = document.body.querySelector('.film-details');
  if (filmDetails !== null) {
    filmDetails.remove();
  }
  document.body.classList.remove('hide-overflow');
};
export default class PopupPresenter {
  #boardMovie = null;
  #popupContainer = null;
  #moviesModel = null;
  #comments = [];
  #popup = null;

  init = (popupContainer, moviesModel, boardMovie) => {
    this.#popupContainer = popupContainer;
    this.#moviesModel = moviesModel;
    this.#boardMovie = boardMovie;
    this.#comments = [...moviesModel.getComments(this.#boardMovie.id)];
    this.#popup = new PopupView(this.#boardMovie, this.#comments);
    render(this.#popup, this.#popupContainer);
    this.#renderPopup();
  };

  #renderPopup = () => {

    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    this.#popup.setCloseClickHandler( () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    document.addEventListener('keydown', onEscKeyDown);
  };
}

export {closePopup};
