import View from './general-view.js';

const createFilmsListEmptyTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class FilmsListEmptyView extends View {
  constructor() {
    super();
  }

  get template() {
    return createFilmsListEmptyTemplate();
  }
}
