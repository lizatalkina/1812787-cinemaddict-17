import {getRandomInteger} from './common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const humanizeCommentDueDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');
const humanizeYearDueDate = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeReleaseDueDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeTimeDueDate = (dueTime) => dayjs.duration(dueTime, 'minutes').format('H[h] mm[m]');

const generateDate = (maxDaysGap, minDaysGap) => {
  const daysGap = getRandomInteger(maxDaysGap, minDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortMovieDate = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieA.filmInfo.release.date, movieB.filmInfo.release.date);

  return weight ?? dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));
};

const sortMovieRating = (movieA, movieB) => {
  if (movieA.filmInfo.totalRating > movieB.filmInfo.totalRating) {
    return -1;
  } else if (movieB.filmInfo.totalRating > movieA.filmInfo.totalRating) {
    return 1;
  } else {
    return 0;
  }
};

export {humanizeCommentDueDate, humanizeYearDueDate, humanizeReleaseDueDate, humanizeTimeDueDate, generateDate, sortMovieDate, sortMovieRating};
