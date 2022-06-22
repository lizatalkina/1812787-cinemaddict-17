import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (moviesCount) => (
  `<section class="footer__statistics">
  <p>${moviesCount} movies inside</p>
  </section>`
);

export default class FooterStatisticsView extends AbstractView {
  #moviesCount = '';

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#moviesCount);
  }

}
