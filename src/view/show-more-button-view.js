import View from './general-view.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}
