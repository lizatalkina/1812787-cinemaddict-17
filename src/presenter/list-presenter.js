import FilmCardView from '../view/film-card-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsView from '../view/films-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {render} from '../render.js';

export default class ListPresenter {
  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView();
  filmslistContainerComponent = new FilmsListContainerView();

  init = (listContainer, moviesModel) => {
    this.listContainer = listContainer;
    this.moviesModel = moviesModel;
    this.boardMovies = [...this.moviesModel.getMovies()];

    render(this.filmsComponent, this.listContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmslistContainerComponent, this.filmsListComponent.getElement());
    for (let i = 0; i < this.boardMovies.length; i++) {
      render(new FilmCardView(this.boardMovies[i]), this.filmslistContainerComponent.getElement());
    }
    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());
  };
}
