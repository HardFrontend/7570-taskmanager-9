import {render, Position, unrender} from "../components/utils";
import {TaskCard} from "../components/card-template";
import {TaskCardEdit} from "../components/card-edit";
import {TaskList} from "../components/task-list";
import {Board} from "../components/board";
import {Filter} from "../components/filter";
import {ResultEmpty} from "../components/result-empty";
import {LoadMoreButton} from "../components/load-more-button";


export class TaskController {
  constructor(container, taskItem, onChangeView, onDataChange) {
    this._taskList = container;
    this._taskItem = taskItem;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._taskView = new TaskCard(taskItem);
    this._taskEdit = new TaskCardEdit(taskItem);

    this.create();
  }

  create() {

    flatpickr(this._taskEdit.getElement().querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._taskItem.dueDate,
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._taskList.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // repaetInner.style.display = `none`;

    this._taskView.getElement()
        .querySelector(`.card__btn--edit`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this._onChangeView();
          this._taskList.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
          document.addEventListener(`keydown`, onEscKeyDown);

          const repaetInner = this._taskEdit.getElement().querySelector(`.card__repeat-days`);
          const repeatStatus = this._taskEdit.getElement().querySelector(`.card__repeat-status`);
          const repeatINput = this._taskEdit.getElement().querySelectorAll(`.card__repeat-day-input`);

          repaetInner.style.display = `none`;
          Object.keys(this._taskItem.repeatingDays).some((day) => {
            if (this._taskItem.repeatingDays[day]) {
              repaetInner.style.display = `block`;
            }
          });

          this._taskEdit.getElement().querySelector(`.card__repeat-toggle`)
            .addEventListener(`click`, (evt) => {
              evt.preventDefault();
              if ((repaetInner.style.display === `none`)) {
                repaetInner.style.display = `block`;
                repeatStatus.innerHTML = `yes`;
              } else {
                repaetInner.style.display = `none`;
                repeatStatus.innerHTML = `no`;
                repeatINput.forEach((item) => {
                  item.checked = false;
                });
              }
            });
        });

    this._taskEdit.getElement().querySelector(`textarea`)
        .addEventListener(`focus`, () => {
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

    this._taskEdit.getElement().querySelector(`textarea`)
        .addEventListener(`blur`, () => {
          document.addEventListener(`keydown`, onEscKeyDown);
        });

    const tagsNew = (array) => {
      let tagsEdit = [];

      array.forEach((item) => {
        if (item.length > 1 && !(/\s/.test(item))) {
          tagsEdit.push(item.replace(/ /g, ``));
        }
      });

      return tagsEdit;
    };

    const onRemoveTag = () => {

    };

    const tagsList = this._taskEdit.getElement()
      .querySelector(`.card__hashtag-list`);

    this._taskEdit.getElement()
      .querySelector(`.card__hashtag-list`).addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.className !== `card__hashtag-delete`) {
          return;
        }

        const buttonRemoveParen = evt.target.parentElement;
        buttonRemoveParen.style.display = `none`;
        const btns = [...this._taskEdit.getElement().querySelectorAll(`.card__hashtag-inner`)];
        const tagIndex = btns.indexOf(buttonRemoveParen);
        const oldTags = [...this._taskItem.tags];

        this._taskItem.tags = [...oldTags.slice(0, tagIndex), ...oldTags.slice(tagIndex + 1)];
      });

    this._taskEdit.getElement()
        .querySelector(`.card__save`)
        .addEventListener(`click`, (evt) => {
          evt.preventDefault();
          const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));

          const entry = {
            description: formData.get(`text`),
            color: formData.get(`color`),
            // tags: [...this._taskItem.tags, ...(formData.getAll(`hashtag-input`))],
            tags: [...this._taskItem.tags, ...tagsNew(formData.getAll(`hashtag-input`))],
            dueDate: new Date(formData.get(`date`)),
            repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
              acc[it] = true;
              return acc;
            }, {
              'mo': false,
              'tu': false,
              'we': false,
              'th': false,
              'fr': false,
              'sa': false,
              'su': false,
            })
          };

          this._onDataChange(entry, this._taskItem);


          document.removeEventListener(`keydown`, onEscKeyDown);
        });

    render(this._taskList.getElement(), this._taskView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._taskList.getElement().contains(this._taskEdit.getElement())) {
      this._taskList.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}
