import FilterModel from './model/filter-model.js';
import ListPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movie-model.js';
import MoviesApiService from './movies-api-service.js';

const AUTHORIZATION = 'Basic nfkrbyf12kbpf34';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteMainElement = document.querySelector('.main');
const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
moviesModel.init();
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(siteMainElement, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

filterPresenter.init();
listPresenter.init();
