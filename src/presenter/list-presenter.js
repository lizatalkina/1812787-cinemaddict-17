import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import SortView from '../view/sort-view.js';
import MoviePresenter from './movie-presenter.js';
import {sortMovieDate, sortMovieRating} from '../utils/movie.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const siteMainElement = document.querySelector('.main');
const MOVIE_COUNT_PER_STEP = 5;

export default class ListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmslistContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #filmsListEmptyComponent = null;
  #listContainer = null;
  #moviesModel = null;
  #filterModel = null;
  #moviePresenter = new Map();
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(listContainer, moviesModel, filterModel) {
    this.#listContainer = listContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies () {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);

    switch (this.#currentSortType) {
      case SortType.DATE_SORT:
        return filteredMovies.sort(sortMovieDate);
      case SortType.RATING_SORT:
        return filteredMovies.sort(sortMovieRating);
    }
    return filteredMovies;
  }

  init = () => {
    this.#renderBoard();
  };

  #handleShowMoreButtomClick = () => {
    const movieCount = this.movies.length;
    const newRenderedMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCount, newRenderedMovieCount);

    this.#renderMovies(movies);
    this.#renderedMovieCount = newRenderedMovieCount;

    if (this.#renderedMovieCount >= movieCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleViewAction = (actionType, updateType, update, comment) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#moviesModel.addComment(updateType, update, comment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviesModel.deleteComment(updateType, update, comment);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedMovieCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, siteMainElement, RenderPosition.AFTERBEGIN);
  };

  #renderMovie = (film) => {
    const moviePresenter = new MoviePresenter(this.#filmslistContainerComponent.element, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderFilmListEmpty = () => {
    this.#filmsListEmptyComponent = new FilmsListEmptyView(this.#filterType);
    render(this.#filmsListEmptyComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtomClick);
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.closeOpeningPopup());
  };

  #clearBoard = ({resetRenderedMovieCount = false, resetSortType = false} = {}) => {
    const movieCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    if (resetRenderedMovieCount) {
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    } else {
      this.#renderedMovieCount = Math.min(movieCount, this.#renderedMovieCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    const movies = this.movies;
    const movieCount = movies.length;
    if (movieCount === 0) {
      render(this.#filmsComponent, this.#listContainer);
      this.#renderFilmListEmpty();
      return;
    }
    this.#renderSort();
    render(this.#filmsComponent, this.#listContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmslistContainerComponent, this.#filmsListComponent.element);
    this.#renderMovies(movies.slice(0, Math.min(movieCount, this.#renderedMovieCount)));
    if (movieCount > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
    }
  };
}
