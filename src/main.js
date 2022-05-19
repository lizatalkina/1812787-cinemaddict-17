import ProfileView from './view/profile-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import SortView from './view/sort-view.js';
import {render} from './render.js';
import ListPresenter from './presenter/list-presenter.js';
import MoviesModel from './model/movie-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const listPresenter = new ListPresenter();
const filterPresenter = new FilterPresenter();
const moviesModel = new MoviesModel();

render(new ProfileView(), siteHeaderElement);
filterPresenter.init(siteMainElement, moviesModel);
render(new SortView(), siteMainElement);

listPresenter.init(siteMainElement, moviesModel);
