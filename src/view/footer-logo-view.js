import AbstractView from '../framework/view/abstract-view.js';

const createFooterLogoTemplate = () =>
  '<section class="footer__logo logo logo--smaller">Cinemaddict</section>';

export default class FooterLogoView extends AbstractView {

  get template() {
    return createFooterLogoTemplate();
  }

}
