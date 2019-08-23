import {createElement} from "./utils";

export class LoadMoreButton {
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<button class="load-more" type="button">load more</button>
`;
  }
}
