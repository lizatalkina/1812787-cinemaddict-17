import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createFilterTemplate = (currentFilterType, filtersCount) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.ALL}"> All movies </a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCHLIST}"> Watchlist <span class="main-navigation__item-count">${filtersCount[FilterType.WATCHLIST]}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.HISTORY}"> History <span class="main-navigation__item-count">${filtersCount[FilterType.HISTORY]}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.FAVORITES}"> Favorites <span class="main-navigation__item-count">${filtersCount[FilterType.FAVORITES]}</span></a>
  </nav>`
);

export default class FilterView extends AbstractView {
  #currentFilterType = null;
  #filtersCount = {};

  constructor(filtersCount, currentFilterType) {
    super();
    this.#filtersCount = filtersCount;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#currentFilterType, this.#filtersCount);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };

}
