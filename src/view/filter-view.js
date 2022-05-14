import View from './general-view.js';

const createFilterTemplate = (watchlist, history, favorites) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
  </nav>`
);
export default class FilterView extends View {
  constructor(watchlist, history, favorites) {
    super();
    this.watchlist = watchlist;
    this.history = history;
    this.favorites = favorites;
  }

  getTemplate() {
    return createFilterTemplate(this.watchlist, this.history, this.favorites);
  }
}
