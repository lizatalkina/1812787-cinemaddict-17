import FilterView from '../view/filter-view.js';
import {render} from '../render.js';

export default class FilterPresenter {
  #watchlist = null;
  #history = null;
  #favorites = null;
  #filterContainer = null;
  init = (filterContainer, moviesModel) => {
    this.#filterContainer = filterContainer;
    this.#watchlist = moviesModel.watchlistCount;
    this.#history = moviesModel.historyCount;
    this.#favorites = moviesModel.favoritesCount;
    render(new FilterView(this.#watchlist, this.#history, this.#favorites), this.#filterContainer);
  };
}
