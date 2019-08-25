import {createElement} from "./utils";

export class HeaderFilter {
  constructor(all, navAmountFavorite, navAmountArchive, navAmountRepeat) {
    this._all = all;
    this._navAmountFavorite = navAmountFavorite;
    this._navAmountArchive = navAmountArchive;
    this._navAmountRepeat = navAmountRepeat;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
                <input
          type="radio"
          id="filter__all"
          class="filter__input visually-hidden"
          name="filter"
          checked
        />
                <label for="filter__all" class="filter__label">
          All <span class="filter__all-count">${this._all}</span></label
        >
                <input
          type="radio"
          id="filter__overdue"
          class="filter__input visually-hidden"
          name="filter"
          disabled
        />
             <label for="filter__overdue" class="filter__label"
          >Overdue <span class="filter__overdue-count">0</span></label
        >
                <input
          type="radio"
          id="filter__today"
          class="filter__input visually-hidden"
          name="filter"
          disabled
        />
                <label for="filter__today" class="filter__label"
          >Today <span class="filter__today-count">0</span></label
        >
             <input
          type="radio"
          id="filter__favorites"
          class="filter__input visually-hidden"
          name="filter"
        />
             <label for="filter__favorites" class="filter__label"
          >Favorites <span class="filter__favorites-count">${this._navAmountFavorite}</span></label
        >
             <input
          type="radio"
          id="filter__repeating"
          class="filter__input visually-hidden"
          name="filter"
        />
             <label for="filter__repeating" class="filter__label"
          >Repeating <span class="filter__repeating-count">${this._navAmountRepeat}</span></label
        >
             <input
          type="radio"
          id="filter__tags"
          class="filter__input visually-hidden"
          name="filter"
        />
             <label for="filter__tags" class="filter__label"
          >Tags <span class="filter__tags-count">1</span></label
        >
              <input
          type="radio"
          id="filter__archive"
          class="filter__input visually-hidden"
          name="filter"
        />
              <label for="filter__archive" class="filter__label"
                >Archive <span class="filter__archive-count">${this._navAmountArchive}</span></label
        >
            </section>
`;
  }
}
