import FilmCardView from '../view/film-card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import {isEscapeKey} from '../utils/common.js';

const siteMainElement = document.querySelector('.main');
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class MoviePresenter {
  #filmslistContainerComponent = null;
  #film = null;
  #movieCardComponent = null;
  #changeData = null;
  #popup = null;
  #comments = [];
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor (filmslistContainer, changeData, changeMode) {
    this.#filmslistContainerComponent = filmslistContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movieCardComponent = new FilmCardView(film);
    this.#movieCardComponent.setCardClickHandler(this.#openPopup);
    this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieCardComponent.setAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#movieCardComponent.setFavoriteHandler(this.#handleFavoriteClick);
    if (prevMovieCardComponent === null) {
      render(this.#movieCardComponent, this.#filmslistContainerComponent);
      return;
    }
    if (this.#filmslistContainerComponent.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }
    remove(prevMovieCardComponent);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
  };

  closeOpeningPopup = () => {
    if (this.#mode === Mode.POPUP) {
      this.#closePopup();
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData(Object.assign({}, this.#film, {
      userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}
    }));
    if (this.#mode !== Mode.DEFAULT) {
      this.#openPopup();
    }
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(Object.assign({}, this.#film, {
      userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
    }));
    if (this.#mode !== Mode.DEFAULT) {
      this.#openPopup();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(Object.assign({}, this.#film, {
      userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}
    }));
    if (this.#mode !== Mode.DEFAULT) {
      this.#openPopup();
    }
  };

  #openPopup = () => {
    this.#changeMode();
    this.#comments = this.#film.getComments();
    this.#popup = new PopupView(this.#film, this.#comments);
    //this.#popup = new PopupView({...this.#film, comments: this.#comments},this.#comments);
    render(this.#popup, siteMainElement);
    this.#popup.setCloseClickHandler(this.#closePopup);
    this.#popup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popup.setAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#popup.setFavoriteHandler(this.#handleFavoriteClick);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
    this.#mode = Mode.POPUP;
  };

  #closePopup = () => {
    remove(this.#popup);
    this.#popup = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closePopup();
    }
  };

}
