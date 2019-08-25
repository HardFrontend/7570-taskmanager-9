import {createElement} from "./utils";

export class HeaderSearch {
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<section class="main__search search container">
            <input
          type="text"
          id="search__input"
          class="search__input"
          placeholder="START TYPING — SEARCH BY WORD, #HASHTAG OR DATE"
          value="#work"
        />
            <label class="visually-hidden" for="search__input">Поиск</label>
          </section>
`;
  }
}
