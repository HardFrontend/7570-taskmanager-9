import {render, Position, unrender} from "../components/utils";
import {TaskCard} from "../components/card-template";
import {TaskCardEdit} from "../components/card-edit";
import {TaskList} from "../components/task-list";
import {Board} from "../components/board";
import {Filter} from "../components/filter";
import {ResultEmpty} from "../components/result-empty";
import {LoadMoreButton} from "../components/load-more-button";


export class TaskController {
  constructor(container, taskItem, onDataChange, onChangeView) {
    this._container = container;
    this._arrayTasks = taskItem;
    this._arraySorted = this._arrayTasks;
    this._headerFilter = new Filter();
    this._board = new Board();
    this._taskList = new TaskList();
    this._resultEmpty = new ResultEmpty();
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;

    this._task = new TaskCard(taskItem);
    this._taskEdit = new TaskCardEdit(taskItem);

    this.create();
  }

  init() {

    if (!this._arraySorted.length) {
      render(this._taskList.getElement(), this._resultEmpty.getElement(), Position.BEFOREEND);
    } else {
      this._renderTaskRow(this._arrayTasks, 0, 4, this._taskList.getElement());
    }
  }

  create() {

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }

    };
    this._task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.getElement().replaceChild(this._taskEdit.getElement(), this._task.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));

        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag-input`)),
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


        this._arraySorted[this._arraySorted.findIndex((it) => it === taskItem)] = entry;

       // unrender(this._taskList.getElement());

        //this._taskList.removeElement();
        render(this._board.getElement(), this._taskList.getElement(), Position.AFTERBEGIN);
        this._renderTaskRow(this._arraySorted, 0, 4, this._taskList.getElement());

        document.removeEventListener(`keydown`, onEscKeyDown);
      });
    render(this._board.getElement(), this._task.getElement(), Position.BEFOREEND);
  }

  _renderTaskRow(array, elementFrom, elementTo, place) {
    const arraySlice = array.slice(elementFrom, elementTo);
    if (!arraySlice.length) {
      render(this._taskList.getElement(), this._resultEmpty.getElement(), Position.BEFOREEND);
    } else {
      arraySlice.slice(elementFrom, elementTo).forEach((dataTask) => this._renderTask(dataTask, place));
    }
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}
