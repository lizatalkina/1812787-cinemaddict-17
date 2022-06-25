import AbstractView from '../framework/view/abstract-view.js';

const ProfileRating = {
  NONE: '',
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const ProfileRatingCount = {
  NONE: [0, 0],
  NOVICE: [1, 10],
  FAN: [11, 20],
  MOVIE_BUFF: [21, Number.MAX_VALUE],
};

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileView extends AbstractView {
  #alreadyWatched = 0;
  #profileRating = 0;

  constructor(alreadyWatched){
    super();
    this.#alreadyWatched = alreadyWatched;
    this.#profileRating = this.#checkProfileRating();
  }

  get template() {
    return createProfileTemplate(this.#checkProfileRating());
  }

  #checkProfileRating = () => {
    if (this.#alreadyWatched >= ProfileRatingCount.MOVIE_BUFF[0] && this.#alreadyWatched <= ProfileRatingCount.MOVIE_BUFF[1]) {
      return ProfileRating.MOVIE_BUFF;
    } else if (this.#alreadyWatched >= ProfileRatingCount.FAN[0] && this.#alreadyWatched <= ProfileRatingCount.FAN[1]) {
      return ProfileRating.FAN;
    } else if (this.#alreadyWatched >= ProfileRatingCount.NOVICE[0] && this.#alreadyWatched <= ProfileRatingCount.NOVICE[1]) {
      return ProfileRating.NOVICE;
    } else if (this.#alreadyWatched >= ProfileRatingCount.NONE[0] && this.#alreadyWatched <= ProfileRatingCount.NONE[1]) {
      return ProfileRating.NONE;
    } else {
      return ProfileRating.NONE;
    }
  };

}
