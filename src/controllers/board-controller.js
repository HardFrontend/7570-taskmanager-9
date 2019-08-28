import {render, Position} from "../components/utils";
import {TaskCard} from "../components/card-template";
import {TaskCardEdit} from "../components/card-edit";
import {TaskList} from "../components/task-list";
import {ResultEmpty} from "../components/result-empty";
import {LoadMoreButton} from "../components/load-more-button";
import {Filter} from "../components/filter";
import {Board} from "../components/board";


export class PageController {
  constructor(container, arrayTasks) {
    this._container = container;
    this._arrayTasks = arrayTasks;
    this._arraySorted = this._arrayTasks;
    this._headerFilter = new Filter();
    this._board = new Board();
    this._taskList = new TaskList();
    this._resultEmpty = new ResultEmpty();
    this._loadMoreButton = new LoadMoreButton();
    this._elementFrom = 0;
    this._TASK_ROW = 4;
  }

  init() {
    render(this._container, this._headerFilter.getElement(), Position.BEFOREEND);
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);

    if (!this._arraySorted.length) {
      render(this._taskList.getElement(), this._resultEmpty.getElement(), Position.BEFOREEND);
    } else {
      this._renderTaskRow(this._arrayTasks, 0, 4, this._taskList.getElement());
      render(this._board.getElement(), this._loadMoreButton.getElement(), Position.BEFOREEND);
    }

    this._loadMoreButton.getElement().addEventListener(`click`, (evt) => this._onButtonShowMore(evt, this._taskList.getElement(), this._arraySorted));
    this._headerFilter.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderTask(taskItem, place) {
    const task = new TaskCard(taskItem);
    const taskEdit = new TaskCardEdit(taskItem);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._taskList.replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.getElement().replaceChild(taskEdit.getElement(), task.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, () => {
        this._taskList.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(place, task.getElement(), Position.BEFOREEND);
  }

  _renderTaskRow(array, elementFrom, elementTo, place) {
    const arraySlice = array.slice(elementFrom, elementTo);
    if (!arraySlice.length) {
      render(this._taskList.getElement(), this._resultEmpty.getElement(), Position.BEFOREEND);
    } else {
      arraySlice.slice(elementFrom, elementTo).forEach((dataTask) => this._renderTask(dataTask, place));
    }
  }

  _onButtonShowMore(evt, place, array) {
    evt.preventDefault();
    this._elementFrom += this._TASK_ROW;
    let elementTo = this._elementFrom + this._TASK_ROW;
    const arraySliced = array.slice(this._elementFrom, elementTo);

    this._renderTaskRow(arraySliced, 0, 4, this._taskList.getElement());

    if (arraySliced.length <= this._TASK_ROW - 1) {
      this._loadMoreButton.getElement().style.display = `none`;
    }
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._taskList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._arraySorted.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._renderTaskRow(sortedByDateUpTasks, 0, 5, this._taskList.getElement());

        break;
      case `date-down`:
        const sortedByDateDownTasks = this._arraySorted.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._renderTaskRow(sortedByDateDownTasks, 0, 5, this._taskList.getElement());
        break;
      case `default`:
        this._renderTaskRow(this._arrayTasks, 0, 5, this._taskList.getElement());
        break;
    }
  }
}
