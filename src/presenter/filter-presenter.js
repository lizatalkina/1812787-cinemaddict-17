import FilterView from '../view/filter-view.js';
import {render, replace, remove} from '../framework/render.js';
import {FilterType, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filtersCount () {
    const movies = this.#moviesModel.movies;
    return {
      [FilterType.ALL]: '',
      [FilterType.WATCHLIST]: filter[FilterType.WATCHLIST](movies).length,
      [FilterType.HISTORY]: filter[FilterType.HISTORY](movies).length,
      [FilterType.FAVORITES]: filter[FilterType.FAVORITES](movies).length,
    };
  }

  get filters () {
    const movies = this.#moviesModel.movies;
    return [
      {
        type: FilterType.ALL,
        count: '',
      },
      {
        type: FilterType.WATCHLIST,
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView(this.filtersCount, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
