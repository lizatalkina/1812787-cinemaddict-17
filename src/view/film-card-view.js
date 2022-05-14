import View from './general-view.js';
import {humanizeYearDueDate, humanizeTimeDueDate} from '../util.js';

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo, userDetails} = film;
  const date = humanizeYearDueDate(filmInfo.release.date);
  const time = humanizeTimeDueDate(filmInfo.runtime);

  const watchlistClassName = (userDetails.watchlist) ? 'film-card__controls-item--active' : '';
  const watchedClassName = (userDetails.alreadyWatched) ? 'film-card__controls-item--active' : '';
  const favoriteClassName = (userDetails.favorite) ? 'film-card__controls-item--active' : '';

  const numberOfComments = comments.length;

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${time}</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
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
export default class FilmCardView extends View {
  constructor(film) {
    super();
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }
}
