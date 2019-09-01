import {render, unrender, Position} from "../components/utils";
import {TaskCard} from "../components/card-template";
import {TaskCardEdit} from "../components/card-edit";
import {TaskList} from "../components/task-list";
import {ResultEmpty} from "../components/result-empty";
import {LoadMoreButton} from "../components/load-more-button";
import {Filter} from "../components/filter";
import {Board} from "../components/board";
import {TaskController} from "../controllers/task-controller";


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

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
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


  _renderTask(taskItem) {
    const taskController = new TaskController(this._taskList, taskItem, this._onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _renderTaskRow(array, elementFrom, elementTo, place) {
    const arraySlice = array.slice(elementFrom, elementTo);
    if (!arraySlice.length) {
      render(this._taskList.getElement(), this._resultEmpty.getElement(), Position.BEFOREEND);
    } else {
      arraySlice.slice(elementFrom, elementTo).forEach((dataTask) => this._renderTask(dataTask, place));
    }
  }

  _renderBoard(tasks) {
    unrender(this._taskList.getElement());
    const arraySlice = tasks.slice(0, this._TASK_ROW);
    this._taskList.removeElement();
    this._elementFrom = 0;
    render(this._board.getElement(), this._taskList.getElement(), Position.AFTERBEGIN);
    arraySlice.forEach((taskMock) => this._renderTask(taskMock));
    console.log(tasks);

    if (tasks.length > this._TASK_ROW && (this._loadMoreButton.getElement().style.display = `none`)) {
      this._loadMoreButton.getElement().style.display = `flex`;
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._arraySorted[this._arraySorted.findIndex((it) => it === oldData)] = newData;
    this._renderBoard(this._arraySorted);
  }

  _onButtonShowMore(evt, place, array) {
    evt.preventDefault();
    this._elementFrom += this._TASK_ROW;
    let elementTo = this._elementFrom + this._TASK_ROW;
    const arraySliced = array.slice(this._elementFrom, elementTo);

    this._renderTaskRow(arraySliced, 0, this._TASK_ROW, this._taskList.getElement());

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
