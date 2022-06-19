import ProfileView from './view/profile-view.js';
import FilterModel from './model/filter-model.js';
import ListPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movie-model.js';
import {render} from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(siteMainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);


render(new ProfileView(), siteHeaderElement);

filterPresenter.init();
listPresenter.init();
