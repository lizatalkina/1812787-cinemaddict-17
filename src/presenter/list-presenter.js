import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import SortView from '../view/sort-view.js';
import MoviePresenter from './movie-presenter.js';
import {updateItem} from '../utils/common.js';

const siteMainElement = document.querySelector('.main');
const MOVIE_COUNT_PER_STEP = 5;

export default class ListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmslistContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #sortComponent = new SortView();
  #filmsListEmptyComponent = new FilmsListEmptyView();
  #listContainer = null;
  #moviesModel = null;
  #boardMovies = [];
  #moviePresenter = new Map();
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(listContainer, moviesModel) {
    this.#listContainer = listContainer;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#boardMovies = [...this.#moviesModel.movies];
    this.#renderBoard();
  };

  #handleShowMoreButtomClick = () => {
    this.#renderMovies(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#boardMovies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleMovieChange = (updateMovie) => {
    this.#boardMovies = updateItem(this.#boardMovies, updateMovie);
    this.#moviePresenter.get(updateMovie.id).init(updateMovie);
  };

  #renderSort = () => {
    render(this.#sortComponent, siteMainElement, RenderPosition.AFTERBEGIN);
  };

  #renderMovie = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmslistContainerComponent.element, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);
  };

  #renderMovies = (from, to) => {
    this.#boardMovies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie));
  };

  #renderFilmListEmpty = () => {
    render(this.#filmsListEmptyComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtomClick);
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.closeOpeningPopup());
  };

  // #clearMovieList = () => {
  //   this.#moviePresenter.forEach((presenter) => presenter.destroy());
  //   this.#moviePresenter.clear();
  //   this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
  //   remove(this.#showMoreButtonComponent);
  // };

  #renderMovieList = () => {
    render(this.#filmsComponent, this.#listContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmslistContainerComponent, this.#filmsListComponent.element);
    this.#renderMovies(0, Math.min(this.#boardMovies.length, MOVIE_COUNT_PER_STEP));
    if (this.#boardMovies.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderBoard = () => {
    if (this.#boardMovies.every((movie) => movie.isEmptyDatabase)) {
      render(this.#filmsComponent, this.#listContainer);
      this.#renderFilmListEmpty();
      return;
    }
    this.#renderSort();
    this.#renderMovieList();

  };
}
