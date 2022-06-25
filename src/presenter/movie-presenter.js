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
  #getComments = null;
  #comments = [];
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor (filmslistContainer, changeData, changeMode, getComments) {
    this.#filmslistContainerComponent = filmslistContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#getComments = getComments;
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

  setSaving = () => {
    if (this.#mode === Mode.POPUP) {
      this.#popup.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.POPUP) {
      this.#popup.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#popup.updateElement({
        isDisabled: false,
        isDeleting: false,
      });
    };

    this.#popup.shake(resetFormState);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
  };

  closeOpeningPopup = () => {
    if (this.#mode === Mode.POPUP) {
      this.#closePopup();
    }
  };

  #renderPopup = async () => {
    this.#changeMode();
    this.#closePopup();
    this.#comments = await this.#getComments(this.#film);
    this.#mode = Mode.POPUP;
    this.#popup = new PopupView(this.#film, this.#comments);
    render(this.#popup, siteMainElement);
    this.#popup.setCloseClickHandler(this.#closePopupRenderBoard);
    this.#popup.setDeleteCommentClickHandler(this.#handleDeleteCommentClick);
    this.#popup.setSendCommentKeydownHandler(this.#handleSendCommentKeydown);
    this.#popup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popup.setAlreadyWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#popup.setFavoriteHandler(this.#handleFavoriteClick);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  };

  #closePopup = () => {
    remove(this.#popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #closePopupRenderBoard = () => {
    this.#closePopup();
  };

  #handleWatchlistClick = async (updateType = UpdateType.MINOR) => {
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
      updateType,
      update);
    this.#film = update;
    if (this.#mode !== Mode.DEFAULT) {
      await this.#renderPopup();
      if (updateScroll) {
        document.querySelector('.film-details').scrollTo(0, scroll);
      }
    }
  };

  #handleAlreadyWatchedClick = async (updateType = UpdateType.MINOR) => {
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
      updateType,
      update);
    this.#film = update;
    if (this.#mode !== Mode.DEFAULT) {
      await this.#renderPopup();
      if (updateScroll) {
        document.querySelector('.film-details').scrollTo(0, scroll);
      }
    }
  };

  #handleFavoriteClick = async (updateType = UpdateType.MINOR) => {
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
      updateType,
      update);
    this.#film = update;
    if (this.#mode !== Mode.DEFAULT) {
      await this.#renderPopup();
      if (updateScroll) {
        document.querySelector('.film-details').scrollTo(0, scroll);
      }
    }
  };

  #handleSendCommentKeydown = async (movie, comment) => {
    const scroll = document.querySelector('.film-details').scrollTop;
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      movie,
      comment,
    );
    this.#film = movie;
    if (this.#mode !== Mode.DEFAULT) {
      await this.#renderPopup();
      document.querySelector('.film-details').scrollTo(0, scroll);
    }
  };

  #handleDeleteCommentClick = async (movie, comment) => {
    const scroll = document.querySelector('.film-details').scrollTop;
    this.#changeData (
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      movie,
      comment,
    );
    this.#film = movie;
    if (this.#mode !== Mode.DEFAULT) {
      await this.#renderPopup();
      document.querySelector('.film-details').scrollTo(0, scroll);
    }
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closePopup();
    }
  };

}
