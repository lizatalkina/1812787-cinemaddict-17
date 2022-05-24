import FilmCardView from '../view/film-card-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render} from '../render.js';
import PopupPresenter from './popup-presenter.js';
import {closePopup} from './popup-presenter.js';
import FilmsListEmptyView from '../view/films-list-empty-view.js';
import SortView from '../view/sort-view.js';

const siteMainElement = document.querySelector('.main');
const MOVIE_COUNT_PER_STEP = 5;

export default class ListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmslistContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #listContainer = null;
  #moviesModel = null;
  #boardMovies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;

  constructor(listContainer, moviesModel) {
    this.#listContainer = listContainer;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#boardMovies = [...this.#moviesModel.movies];
    this.#renderBoard();
  };

  #handleShowMoreButtomClick = (evt) => {
    evt.preventDefault();
    this.#boardMovies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#boardMovies.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderMovie = (film) => {
    const movieCard = new FilmCardView(film, this.#filmslistContainerComponent.element);

    const openPopup = () => {
      closePopup();
      const popupPresenter = new PopupPresenter();
      popupPresenter.init(siteMainElement, this.#moviesModel, film);
      document.body.classList.add('hide-overflow');
    };

    movieCard.element.querySelector('.film-card__link').addEventListener('click', (evt) => {
      evt.preventDefault();
      openPopup();
    });

    render(movieCard, this.#filmslistContainerComponent.element);
  };

  #renderBoard = () => {
    if (this.#boardMovies.every((movie) => movie.isEmptyDatabase)) {
      render(this.#filmsComponent, this.#listContainer);
      render(new FilmsListEmptyView(), this.#filmsComponent.element);
    } else {
      render(new SortView(), siteMainElement);
      render(this.#filmsComponent, this.#listContainer);
      render(this.#filmsListComponent, this.#filmsComponent.element);
      render(this.#filmslistContainerComponent, this.#filmsListComponent.element);
      for (let i = 0; i < Math.min(this.#boardMovies.length, MOVIE_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.#boardMovies[i]);
      }
      if (this.#boardMovies.length > MOVIE_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
        this.#showMoreButtonComponent.element.addEventListener('click', this.#handleShowMoreButtomClick);
      }
    }
  };
}
