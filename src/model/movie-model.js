import Observable from '../framework/observable.js';
import {generateMovie} from '../mock/movie.js';
import {comments} from '../mock/comment.js';

const MOVIES_COUNT = 24;

export default class MoviesModel extends Observable{
  #movies = [];
  #comments = [];
  constructor() {
    super();
    this.#comments = comments;
    for (let i = 0; i < MOVIES_COUNT; i++) {
      const movieData = generateMovie();
      movieData.comments = this.#comments.filter(
        (comment) => movieData.comments.includes(comment.id)
      );
      this.#movies.push(movieData);
    }
  }

  get movies () {
    return this.#movies;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error ('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, movieUpdate, newComment) => {
    this.#comments.push(newComment);

    this.updateMovie(updateType, movieUpdate);

    this._notify(updateType, movieUpdate);
  };

  deleteComment = (updateType, movieUpdate, commentUpdate) => {
    const movieCommentIndex = movieUpdate.comments.findIndex((comment) => comment.id.toString() === commentUpdate);

    if (movieCommentIndex === -1) {
      throw new Error ('Can\'t update unexisting movie');
    }

    const commentIndex = this.#comments.findIndex((comment) => comment.id.toString() === commentUpdate);

    if (commentIndex === -1) {
      throw new Error ('Can\'t delete unexisting comment');
    }

    movieUpdate.comments = [
      ...movieUpdate.comments.slice(0, movieCommentIndex),
      ...movieUpdate.comments.slice(movieCommentIndex + 1),
    ];

    this.#comments = [
      ...this.#comments.slice(0, commentIndex),
      ...this.#comments.slice(commentIndex + 1),
    ];

    this.updateMovie(updateType, movieUpdate);

    this._notify(updateType, movieUpdate);
  };

  getComments = (movieId) => {
    const movie = this.movies.find((el) => el.id === movieId);
    return comments.filter(
      (comment) => movie.comments.includes(comment.id)
    );
  };
}
