import {getRandomInteger, getRandomFloat,getArrayWithRandomElements, getRandomArrayElement} from '../utils/common.js';
import {generateDate} from '../utils/movie.js';
import {comments} from './comment.js';
import {nanoid} from 'nanoid';

const authors = [
  'Burt Lancaster',
  'Marcello Mastroianni',
  'Henry Fonda',
  'Anthony Quinn',
  'Katharine Hepburn',
  'Elizabeth Taylor',
  'Anne Bancroft',
];

const titles = [
  'Made for each other',
  'The Baron of Arizona',
  'Beyond the Purple Hills',
  'Duchess of Idaho',
  'Guilty of Treason',
  'The Petty Girl',
  'Please Believe Me',
];

const posters = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const ages = [
  '0+',
  '6+',
  '12+',
  '18+',
];

const countries = [
  'USA',
  'Italy',
  'Germany',
  'Spain',
  'UK',
  'Finland',
];

const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Thriller',
  'Western',
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const commentsIDs = comments.map((a) => a.id);

export const generateMovie = () => ({
  id: nanoid(),
  comments: getArrayWithRandomElements(commentsIDs),
  filmInfo: {
    title: getRandomArrayElement(titles),
    alternativeTitle: `Original: ${getRandomArrayElement(titles)}`,
    totalRating: getRandomFloat(1, 10, 1),
    poster: getRandomArrayElement(posters),
    ageRating: getRandomArrayElement(ages),
    director: getRandomArrayElement(authors),
    writers: getArrayWithRandomElements(authors).join(', '),
    actors: getArrayWithRandomElements(authors).join(', '),
    release: {
      date: generateDate(-29000, 0),
      releaseCountry: getRandomArrayElement(countries),
    },
    runtime: getRandomInteger(30, 200),
    genre: getArrayWithRandomElements(genres).join(' '),
    description: getArrayWithRandomElements(descriptions).join(' '),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger()),
    alreadyWatched: Boolean(getRandomInteger()),
    watchingDate: generateDate(-3600, 0),
    favorite: Boolean(getRandomInteger()),
  },
});
