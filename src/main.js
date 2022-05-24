import ProfileView from './view/profile-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './render.js';
import ListPresenter from './presenter/list-presenter.js';
import MoviesModel from './model/movie-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const moviesModel = new MoviesModel();
const listPresenter = new ListPresenter(siteMainElement, moviesModel);
const filterPresenter = new FilterPresenter();


render(new ProfileView(), siteHeaderElement);
filterPresenter.init(siteMainElement, moviesModel);

listPresenter.init();
