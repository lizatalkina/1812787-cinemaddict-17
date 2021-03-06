import AbstractView from '../framework/view/abstract-view.js';
import {humanizeYearDueDate, humanizeTimeDueDate} from '../utils/movie.js';

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo, userDetails, id} = film;
  const date = humanizeYearDueDate(filmInfo.release.date);
  const time = humanizeTimeDueDate(filmInfo.runtime);

  const watchlistClassName = (userDetails.watchlist) ? 'film-card__controls-item--active' : '';
  const watchedClassName = (userDetails.alreadyWatched) ? 'film-card__controls-item--active' : '';
  const favoriteClassName = (userDetails.favorite) ? 'film-card__controls-item--active' : '';

  const numberOfComments = comments.length;

  return (
    `<article class="film-card">
    <a class="film-card__link" id=${id}>
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${time}</span>
        <span class="film-card__genre">${(filmInfo.genre).join(' ')}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
        ${filmInfo.description !== null ? `<p class="film-card__description">${filmInfo.description}</p>` : ''}
      <span class="film-card__comments">${numberOfComments} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};
export default class FilmCardView extends AbstractView {
  #film = null;
  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setCardClickHandler = (callback) => {
    this._callback.cardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#cardClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
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

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };
}
