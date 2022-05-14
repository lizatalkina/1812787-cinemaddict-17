import FilterView from '../view/filter-view.js';
import {render} from '../render.js';

export default class FilterPresenter {

  init = (filterContainer, moviesModel) => {
    this.filterContainer = filterContainer;
    this.watchlist = moviesModel.getWatchlistCount();
    this.history = moviesModel.getHistoryCount();
    this.favorites = moviesModel.getFavoritesCount();
    render(new FilterView(this.watchlist, this.history, this.favorites), filterContainer);
  };
}
