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

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomInteger, getRandomFloat, getArrayWithRandomElements, getRandomArrayElement, isEscapeKey};
