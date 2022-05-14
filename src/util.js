import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (min, max, precision) => {
  if (min > max) {
    const swap = max;
    max = min;
    min = swap;
  }
  return (Math.random() * (max - min) + min).toFixed(precision);
};

const humanizeCommentDueDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');
const humanizeYearDueDate = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeReleaseDueDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeTimeDueDate = (dueTime) => dayjs.duration(dueTime, 'minutes').format('H[h] mm[m]');

const getArrayWithRandomElements = (sourceArray) => {
  const noRepeatArray = [];
  sourceArray.forEach((element) => {
    if (getRandomInteger(0, 1)) {
      noRepeatArray.push(element);
    }
  });
  return noRepeatArray;
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const generateDate = (maxDaysGap, minDaysGap) => {
  const daysGap = getRandomInteger(maxDaysGap, minDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

export {getRandomInteger, getRandomFloat, humanizeCommentDueDate, humanizeYearDueDate, humanizeReleaseDueDate, humanizeTimeDueDate, getArrayWithRandomElements, getRandomArrayElement, generateDate};
