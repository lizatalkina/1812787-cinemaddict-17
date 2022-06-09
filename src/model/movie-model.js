import {generateMovie} from '../mock/movie.js';
import {comments} from '../mock/comment.js';

class Movie {
  id;
  comments;
  filmInfo;
  userDetails;
  constructor(movieData) {
    this.id = movieData.id;
    this.comments = movieData.comments;
    this.filmInfo = movieData.filmInfo;
    this.userDetails = movieData.userDetails;
  }

  getComments = () => comments.filter(
    (comment) => this.comments.includes(comment.id)
  );
}

export default class MoviesModel {
  #movies = [];
  #watchlistCount = 0;
  #historyCount = 0;
  #favoritesCount = 0;
  constructor() {
    const moviesData = Array.from({length: 24}, generateMovie);
    for (let i = 0; i < moviesData.length; i++) {
      const movie = new Movie(moviesData[i]);
      this.#movies.push(movie);
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
