import PopupView from '../view/popup-view.js';
import {render} from '../render.js';
import {isEscapeKey} from '../util.js';

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

  init = (popupContainer, moviesModel, boardMovie) => {
    this.#popupContainer = popupContainer;
    this.#moviesModel = moviesModel;
    this.#boardMovie = boardMovie;
    this.#comments = [...moviesModel.getComments(this.#boardMovie.id)];
    render(new PopupView(this.#boardMovie, this.#comments), this.#popupContainer);
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

    this.#popupContainer.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    document.addEventListener('keydown', onEscKeyDown);
  };
}

export {closePopup};
