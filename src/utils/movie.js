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

export {humanizeCommentDueDate, humanizeYearDueDate, humanizeReleaseDueDate, humanizeTimeDueDate, generateDate};
