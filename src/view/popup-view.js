import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeReleaseDueDate, humanizeTimeDueDate, humanizeCommentDueDate} from '../utils/movie.js';

const createPopupTemplate = (state) => {
  const {filmInfo, userDetails, comments, checkEmoji} = state;
  const releaseDate = humanizeReleaseDueDate(filmInfo.release.date);
  const time = humanizeTimeDueDate(filmInfo.runtime);
  const emoji = checkEmoji;

  const genres = filmInfo.genre.split(' ');
  const genresTemplate = genres.map((genre) =>
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
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${humanizeCommentDueDate(comment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
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

            <p class="film-details__age">${filmInfo.ageRating}</p>
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
                <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
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

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${numberOfComments}</span></h3>

          <ul class="film-details__comments-list"> ${commentsTemplate}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
            ${emoji === '' ? '' : `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}"></img>`}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emoji === 'smile' ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emoji === 'sleeping' ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emoji === 'puke' ? 'checked = true' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emoji === 'angry' ? 'checked = true' : ''}>
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
  constructor(film, comments) {
    super();
    const moviePopup = {...film, comments: comments};
    this._state = PopupView.parseMovieToState(moviePopup);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state);
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
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
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick(PopupView.parseStateToMovie(this._state));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
  };

  #smileRadioButtonHandler = (evt) => {
    evt.preventDefault();
    // const tempScrollX = window.screenX;
    //const tempScrollY = window.scrollY;
    document.body.style.overflowY = 'hidden';
    this.updateElement({
      checkEmoji: 'smile',
    });
    document.body.style.overflowY = 'inherit';
    //window.scrollTo(0, tempScrollY);
  };

  #sleepingRadioButtonHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkEmoji: 'sleeping',
    });
  };

  #pukeRadioButtonHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkEmoji: 'puke',
    });
  };

  #angryRadioButtonHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkEmoji: 'angry',
    });
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
  };

  static parseMovieToState = (moviePopup) => ({...moviePopup,
    checkEmoji: '',
    userComment: ''});

  static parseStateToMovie = (state) => {
    const movie = {...state};
    if (movie.checkEmoji) {
      movie.comments.emotion = movie.checkEmoji;
    }
    if (movie.userComment) {
      movie.comments.comment = movie.userComment;
    }

    delete movie.checkEmoji;
    delete movie.userComment;
  };
}
