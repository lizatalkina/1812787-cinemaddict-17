import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

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

    const closePopup = () => {
      document.body.querySelector('.film-details').remove();
      document.body.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
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
