import FilmCardView from '../view/film-card-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render} from '../render.js';
import PopupPresenter from './popup-presenter.js';
import {closePopup} from './popup-presenter.js';

const siteMainElement = document.querySelector('.main');
export default class ListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmslistContainerComponent = new FilmsListContainerView();
  #listContainer = null;
  #moviesModel = null;
  #boardMovies = [];

  init = (listContainer, moviesModel) => {
    this.#listContainer = listContainer;
    this.#moviesModel = moviesModel;
    this.#boardMovies = [...this.#moviesModel.movies];

    render(this.#filmsComponent, this.#listContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmslistContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < this.#boardMovies.length; i++) {
      this.#renderMovie(this.#boardMovies[i]);
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);
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
}
