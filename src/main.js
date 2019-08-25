import {Position, render} from "./components/utils";
import {Header} from "./components/site-header";
import {HeaderSearch} from "./components/site-search";
import {HeaderFilter} from "./components/filter";
import {LoadMoreButton} from "./components/load-more-button";
import {TaskCardEdit} from "./components/card-edit";
import {TaskCard} from "./components/card-template";
import {Board} from "./components/board";
import {getTask} from "./components/data";

const TASK_COUNT = 17;
const TASK_ROW = 8;

const getDataTasks = () => {
  let arrayFilms = [];

  new Array(TASK_COUNT).fill(``).forEach(() => arrayFilms.push(getTask()));
  return arrayFilms;
};

const dataTasks = getDataTasks();
const dataTasksCount = dataTasks.length;


const mainControl = document.querySelector(`.main__control`);
const main = document.querySelector(`.main`);
const wrapper = document.createElement(`div`);
wrapper.classList.add(`container`);


const renderHeader = () => {
  const header = new Header();

  render(mainControl, header.getElement(), Position.BEFOREEND);
};
renderHeader();

const renderHeaderSearch = () => {
  const headerSearch = new HeaderSearch();

  render(main, headerSearch.getElement(), Position.BEFOREEND);
};
renderHeaderSearch();

const countNavTasks = (attribute) => {
  let count = 0;

  dataTasks.forEach((item) => {
    if (item[attribute]) {
      count += 1;
    }
  });

  return count;
};

const navRepeat = () =>
  dataTasks.filter(
      (item) => Object.values(item.repeatingDays).includes(true)
  ).length;

const navAmountFavorite = countNavTasks(`isFavorite`);
const navAmountArchive = countNavTasks(`isArchive`);
const navAmountRepeat = navRepeat();

const renderHeaderFilter = (dataTasksAmount, navCountFavorite, navCountArchive, navCountRepeat) => {
  const headerFilter = new HeaderFilter(dataTasksAmount, navCountFavorite, navCountArchive, navCountRepeat);

  render(main, headerFilter.getElement(), Position.BEFOREEND);
};
renderHeaderFilter(dataTasksCount, navAmountFavorite, navAmountArchive, navAmountRepeat);

const renderBoard = () => {
  const board = new Board();

  render(main, board.getElement(), Position.BEFOREEND);
};
renderBoard();

const boardElement = main.querySelector(`.board`);
const tasksContainer = main.querySelector(`.board__tasks`);

const renderTask = (taskData) => {
  const task = new TaskCard(taskData);
  const taskEdit = new TaskCardEdit(taskData);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
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
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(tasksContainer, task.getElement(), Position.BEFOREEND);
};

const renderTaskRow = (array, elementFrom, elementTo) => {
  dataTasks.slice(elementFrom, elementTo).forEach((dataTask) => renderTask(dataTask));
};

renderTaskRow(dataTasks, 0, TASK_ROW);


const renderLoadMoreButton = () => {
  const loadMoreButton = new LoadMoreButton();

  render(boardElement, loadMoreButton.getElement(), Position.BEFOREEND);
};
renderLoadMoreButton();

const loadMore = document.querySelector(`.load-more`);

let elementFrom = 0;

const onButtonShowMore = () => {
  elementFrom += TASK_ROW;
  let elementTo = elementFrom + TASK_ROW;
  const arraySliced = dataTasks.slice(elementFrom, elementTo);

  renderTaskRow(dataTasks, elementFrom, elementTo);

  if (arraySliced.length <= TASK_ROW - 1) {
    loadMore.style.display = `none`;
  }
};

loadMore.addEventListener(`click`, onButtonShowMore);

