import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends Observable{
  #moviesApiService = null;
  #movies = [];
  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies () {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error ('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        update,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  };

  updateLocalMovie = (updateType, update) => {
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

  getCommentsByMovie = async (update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error ('Can\'t find unexisting comments');
    }
    try {
      const foundComments = await this.#moviesApiService.getCommentsByMovie(update);
      return foundComments;
    } catch(err) {
      throw new Error('Can\'t find comments');
    }
  };

  addComment = async (updateType, movieUpdate, userComment) => {
    try {
      const addResponse = await this.#moviesApiService.addCommentByMovie(userComment, movieUpdate.id);
      const updatedMovie = this.#adaptToClient(addResponse.movie);
      this.updateLocalMovie(updateType, updatedMovie);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, movieUpdate, commentUpdate) => {
    try {
      const response = await this.#moviesApiService.deleteCommentByID(commentUpdate);
      if (response.ok) {
        const movieCommentIndex = movieUpdate.comments.findIndex((comment) => comment.toString() === commentUpdate);

        if (movieCommentIndex === -1) {
          throw new Error ('Can\'t update unexisting movie');
        }
        movieUpdate.comments = [
          ...movieUpdate.comments.slice(0, movieCommentIndex),
          ...movieUpdate.comments.slice(movieCommentIndex + 1),
        ];
        this.updateLocalMovie(updateType, movieUpdate);
      }
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      id: movie.id,
      comments: movie.comments,
      filmInfo: {
        title: movie.film_info.title,
        alternativeTitle: movie.film_info.alternative_title,
        totalRating: movie.film_info.total_rating,
        poster: movie.film_info.poster,
        ageRating: movie.film_info.age_rating,
        director: movie.film_info.director,
        writers: movie.film_info.writers,
        actors: movie.film_info.actors,
        release: {
          date: new Date (movie.film_info.release.date),
          releaseCountry: movie.film_info.release.release_country,
        },
        runtime: movie.film_info.runtime,
        genre: movie.film_info.genre,
        description: movie.film_info.description,
      },
      userDetails: {
        watchlist: movie.user_details.watchlist,
        alreadyWatched: movie.user_details.already_watched,
        watchingDate: new Date (movie.user_details.watching_date),
        favorite: movie.user_details.favorite,
      },
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  };
}
