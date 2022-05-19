import {generateMovie} from '../mock/movie.js';
import {comments} from '../mock/comment.js';

export default class MoviesModel {
  #movies = Array.from({length: 5}, generateMovie);
  #watchlistCount = this.movies.filter((movie) => movie.userDetails.watchlist).length;
  #historyCount = this.movies.filter((movie) => movie.userDetails.alreadyWatched).length;
  #favoritesCount = this.movies.filter((movie) => movie.userDetails.favorite).length;

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
