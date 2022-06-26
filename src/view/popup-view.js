import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeReleaseDueDate, humanizeTimeDueDate, humanizeCommentDueDate} from '../utils/movie.js';
import he from 'he';
import {UpdateType} from '../const.js';

const pressed = new Set();
const keysMetaEnter = ['Meta', 'Enter'];
const keysControlEnter = ['Control', 'Enter'];
const Emoji = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const createPopupTemplate = (state, comments) => {
  const {filmInfo, userDetails, checkEmoji, userComment, isDisabled, isDeleting} = state;
  const releaseDate = humanizeReleaseDueDate(filmInfo.release.date);
  const time = humanizeTimeDueDate(filmInfo.runtime);

  const genresTemplate = filmInfo.genre.map((genre) =>
    `<span class="film-details__genre">${genre}</span>`
  ).join('\r\n');

  const watchlistClassName = (userDetails.watchlist) ? 'film-details__control-button--active' : '';
  const watchedClassName = (userDetails.alreadyWatched) ? 'film-details__control-button--active' : '';
  const favoriteClassName = (userDetails.favorite) ? 'film-details__control-button--active' : '';

  const numberOfComments = comments.length;

  const commentsTemplate = comments.map((comment) =>
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${humanizeCommentDueDate(comment.date)}</span>
        <button class="film-details__comment-delete" data-id=${comment.id} ${isDisabled ? 'disabled' : ''}>
        ${isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </p>
    </div>
  </li>`
  ).join('');

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

            <p class="film-details__age">${filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${time}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${genresTemplate}
              </tr>
            </table>
            <p class="film-details__film-description">
              ${filmInfo.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container" ${isDisabled ? 'disabled' : ''}>
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${numberOfComments}</span></h3>

          <ul class="film-details__comments-list"> ${commentsTemplate}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
            ${checkEmoji === '' ? '' : `<img src="./images/emoji/${checkEmoji}.png" width="55" height="55" alt="emoji-${checkEmoji}"></img>`}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${userComment}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${checkEmoji === Emoji.SMILE ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${checkEmoji === Emoji.SLEEPING ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${checkEmoji === Emoji.PUKE ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${checkEmoji === Emoji.ANGRY ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`
  );
};
export default class PopupView extends AbstractStatefulView {
  comments = [];
  film = null;
  constructor(film, comments) {
    super();
    this.comments = comments;
    this.film = film;
    this._state = PopupView.parseMovieToState(film);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state, this.comments);
  }

  reset = (movie) => {
    this.updateElement(
      PopupView.parseMovieToState(movie),
    );
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteCommentClickHandler);
  };

  setSendCommentKeydownHandler = (callback) => {
    pressed.clear();
    this._callback.sendCommentKeydown = callback;
    document.removeEventListener('keydown', this.#sendCommentKeydownHandler);
    document.removeEventListener('keyup', (evt) => {
      pressed.delete(evt.key);
    });
    document.addEventListener('keydown', this.#sendCommentKeydownHandler);
    document.addEventListener('keyup', (evt) => {
      pressed.delete(evt.key);
    });
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(UpdateType.PATCH);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick(UpdateType.PATCH);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(UpdateType.PATCH);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('button')) {
      const commentId = evt.target.dataset.id;
      this._callback.deleteCommentClick(PopupView.parseStateToMovie(this._state), commentId);
    }
  };

  #sendCommentKeydownHandler = (evt) => {
    pressed.add(evt.key);
    let isMetaEnter = true;
    let isControlEnter = true;

    for (const key of keysMetaEnter) {
      if (!pressed.has(key)) {
        isMetaEnter = false;
      }
    }

    for (const key of keysControlEnter) {
      if (!pressed.has(key)) {
        isControlEnter = false;
      }
    }

    if (!isMetaEnter && !isControlEnter) {
      return;
    }

    evt.preventDefault();
    pressed.clear();
    const userComment = document.querySelector('.film-details__comment-input')?.value ?? this._state.userComment;
    const checkEmoji = document.querySelector('.film-details__emoji-item[checked="true"]')?.value ?? this._state.checkEmoji;
    if ((checkEmoji) && (userComment)) {
      const localComment = {};
      localComment.comment = userComment;
      localComment.emotion = checkEmoji;
      this._callback.sendCommentKeydown(PopupView.parseStateToMovie(this._state), localComment);
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setSendCommentKeydownHandler(this._callback.sendCommentKeydown);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteHandler(this._callback.favoriteClick);
  };

  #textCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      userComment: evt.target.value,
    });
  };

  #smileRadioButtonHandler = (evt) => {
    evt.preventDefault();
    const scroll = document.querySelector('.film-details').scrollTop;
    this.updateElement({
      checkEmoji: Emoji.SMILE,
    });
    document.querySelector('.film-details').scrollTo(0, scroll);
  };

  #sleepingRadioButtonHandler = (evt) => {
    evt.preventDefault();
    const scroll = document.querySelector('.film-details').scrollTop;
    this.updateElement({
      checkEmoji: Emoji.SLEEPING,
    });
    document.querySelector('.film-details').scrollTo(0, scroll);
  };

  #pukeRadioButtonHandler = (evt) => {
    evt.preventDefault();
    const scroll = document.querySelector('.film-details').scrollTop;
    this.updateElement({
      checkEmoji: Emoji.PUKE,
    });
    document.querySelector('.film-details').scrollTo(0, scroll);
  };

  #angryRadioButtonHandler = (evt) => {
    evt.preventDefault();
    const scroll = document.querySelector('.film-details').scrollTop;
    this.updateElement({
      checkEmoji: Emoji.ANGRY,
    });
    document.querySelector('.film-details').scrollTo(0, scroll);
  };

  #setInnerHandlers = () => {
    this.element.querySelector ('#emoji-smile')
      .addEventListener('click', this.#smileRadioButtonHandler);
    this.element.querySelector('#emoji-sleeping')
      .addEventListener('click', this.#sleepingRadioButtonHandler);
    this.element.querySelector('#emoji-puke')
      .addEventListener('click', this.#pukeRadioButtonHandler);
    this.element.querySelector('#emoji-angry')
      .addEventListener('click', this.#angryRadioButtonHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textCommentInputHandler);
  };

  static parseMovieToState = (moviePopup) => ({...moviePopup,
    checkEmoji: '',
    userComment: '',
    isDisabled: false,
    isDeleting: false,
  });

  static parseStateToMovie = (state) => {
    const movie = {...state};
    delete movie.checkEmoji;
    delete movie.userComment;
    delete movie.isDisabled;
    delete movie.isDeleting;

    return movie;
  };
}
