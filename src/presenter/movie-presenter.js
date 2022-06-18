import FilmCardView from '../view/film-card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupView from '../view/popup-view.js';
import {isEscapeKey} from '../utils/common.js';
import {UserAction, UpdateType} from '../const.js';

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
    this.#movieCardComponent.setCardClickHandler(this.#renderPopup);
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
    const update = Object.assign({}, this.#film, {
      userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}
    });
    const updateScroll = document.querySelector('.film-details') !== null;
    let scroll = 0;
    if (updateScroll) {
      scroll = document.querySelector('.film-details').scrollTop;
    }
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      update);
    this.#film = update;
    if (this.#mode !== Mode.DEFAULT) {
      this.#renderPopup();
      if (updateScroll) {
        document.querySelector('.film-details').scrollTo(0, scroll);
      }
    }
  };

  #handleAlreadyWatchedClick = () => {
    const update = Object.assign({}, this.#film, {
      userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
    });
    const updateScroll = document.querySelector('.film-details') !== null;
    let scroll = 0;
    if (updateScroll) {
      scroll = document.querySelector('.film-details').scrollTop;
    }
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      update);
    this.#film = update;
    if (this.#mode !== Mode.DEFAULT) {
      this.#renderPopup();
      if (updateScroll) {
        document.querySelector('.film-details').scrollTo(0, scroll);
      }
    }
  };

  #handleFavoriteClick = () => {
    const update = Object.assign({}, this.#film, {
      userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}
    });
    const updateScroll = document.querySelector('.film-details') !== null;
    let scroll = 0;
    if (updateScroll) {
      scroll = document.querySelector('.film-details').scrollTop;
    }
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.PATCH,
      update);
    this.#film = update;
    if (this.#mode !== Mode.DEFAULT) {
      this.#renderPopup();
      if (updateScroll) {
        document.querySelector('.film-details').scrollTo(0, scroll);
      }
    }
  };

  #renderPopup = () => {
    this.#changeMode();
    this.#closePopup();
    this.#popup = new PopupView(this.#film);
    render(this.#popup, siteMainElement);
    this.#popup.setCloseClickHandler(this.#closePopupRenderBoard);
    this.#popup.setDeleteCommentClickHandler(this.#handleDeleteCommentClick);
    this.#popup.setSendCommentKeydownHandler(this.#handleSendCommentKeydown);
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

  #closePopupRenderBoard = () => {
    this.#closePopup();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #handleSendCommentKeydown = (movie, comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      movie,
      comment,
    );
    this.#film = movie;
    const scroll = document.querySelector('.film-details').scrollTop;
    if (this.#mode !== Mode.DEFAULT) {
      this.#renderPopup();
      document.querySelector('.film-details').scrollTo(0, scroll);
    }
  };

  #handleDeleteCommentClick = (movie, comment) => {
    this.#changeData (
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      movie,
      comment,
    );
    this.#film = movie;
    const scroll = document.querySelector('.film-details').scrollTop;
    if (this.#mode !== Mode.DEFAULT) {
      this.#renderPopup();
      document.querySelector('.film-details').scrollTo(0, scroll);
    }
  };

}
