import View from './general-view.js';

const createFilmsTemplate = () => '<section class="films"></section>';

export default class FilmsView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsTemplate();
  }
}
