import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ProfileView from '../view/profile-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import MoviePresenter from './movie-presenter.js';
import {sortMovieDate, sortMovieRating} from '../utils/movie.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filterMethod} from '../utils/filter.js';
import FooterLogoView from '../view/footer-logo-view.js';
import FooterStatisticsView from '../view/footer-statistics-view.js';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteHeaderElement = document.querySelector('.header');

const MOVIE_COUNT_PER_STEP = 5;

export default class ListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmslistContainerComponent = new FilmsListContainerView();
  #loadingComponent = new LoadingView();
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #filmsListEmptyComponent = null;
  #listContainer = null;
  #footerLogoComponent = null;
  #footerStatisticsComponent  = null;
  #moviesModel = null;
  #filterModel = null;
  #headerComponent = null;

  #moviePresenter = new Map();
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

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
    const filteredMovies = filterMethod[this.#filterType](movies);

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

  #handleViewAction = async (actionType, updateType, update, comment) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviePresenter.get(update.id).setSaving();
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#moviePresenter.get(update.id).setSaving();
        try {
          await this.#moviesModel.addComment(updateType, update, comment);
        } catch(err) {
          this.#moviePresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviePresenter.get(update.id).setSaving();
        this.#moviePresenter.get(update.id).setDeleting();
        this.#moviesModel.deleteComment(updateType, update, comment);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#renderHeader();
        this.#moviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#renderHeader();
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#renderHeader();
        this.#clearBoard({resetRenderedMovieCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderHeader();
        this.#renderBoard();
        this.#renderFooter();
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
    const moviePresenter = new MoviePresenter(this.#filmslistContainerComponent.element, this.#handleViewAction, this.#handleModeChange, this.#moviesModel.getCommentsByMovie);
    moviePresenter.init(film);
    this.#moviePresenter.set(film.id, moviePresenter);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
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
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    this.#renderedMovieCount = resetRenderedMovieCount ? MOVIE_COUNT_PER_STEP : Math.min(movieCount, this.#renderedMovieCount);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      render(this.#filmsComponent, this.#listContainer);
      this.#renderLoading();
      return;
    }

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

  #renderHeader = () => {
    const movies = this.movies;
    const alreadyWatched = filterMethod[FilterType.WATCHLIST](movies).length;
    if (this.#headerComponent !== null) {
      remove(this.#headerComponent);
    }
    this.#headerComponent = new ProfileView(alreadyWatched);
    render(this.#headerComponent, siteHeaderElement);
  };

  #renderFooter = () => {
    const movies = this.movies;
    const moviesCount = movies.length;

    this.#footerLogoComponent = new FooterLogoView();
    this.#footerStatisticsComponent = new FooterStatisticsView(moviesCount);
    render(this.#footerLogoComponent, siteFooterElement, RenderPosition.AFTERBEGIN);
    render(this.#footerStatisticsComponent, siteFooterElement, RenderPosition.BEFOREEND);
  };

}
