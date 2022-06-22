import {FilterType} from '../const.js';

const filterMethod = {
  [FilterType.ALL]: (movies) => movies.filter(() => true),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
};

export {filterMethod};
