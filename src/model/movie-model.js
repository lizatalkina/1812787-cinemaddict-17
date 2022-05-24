import {generateMovie} from '../mock/movie.js';
import {comments} from '../mock/comment.js';

export default class MoviesModel {
  #movies;
  #watchlistCount = 0;
  #historyCount = 0;
  #favoritesCount = 0;
  constructor() {
    this.#movies = Array.from({length: 5}, generateMovie);
    for (let i = 0; i < this.#movies.length; i++) {
      const movie = this.#movies[i];
      if (movie.userDetails.watchlist) {
        this.#watchlistCount++;
      }
      if (movie.userDetails.alreadyWatched) {
        this.#historyCount++;
      }
      if (movie.userDetails.favorite) {
        this.#favoritesCount++;
      }
    }
  }

  get movies () {
    return this.#movies;
  }

  get watchlistCount () {
    return this.#watchlistCount;
  }

  get historyCount () {
    return this.#historyCount;
  }

  get favoritesCount () {
    return this.#favoritesCount;
  }

  getComments = (movieId) => {
    const movie = this.movies.find((el) => el.id === movieId);
    return comments.filter(
      (comment) => movie.comments.includes(comment.id)
    );
  };
}
