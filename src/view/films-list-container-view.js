import View from './general-view.js';

const createFilmsListContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListContainerView extends View {
  constructor() {
    super();
  }

  get template() {
    return createFilmsListContainerTemplate();
  }
}
