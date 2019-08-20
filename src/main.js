import {createSiteHeader} from "./components/site-header";
import {createSiteSearch} from "./components/site-search";
import {createFilter} from "./components/filter";
import {createLoadMoreButton} from "./components/load-more-button";
import {createCardEdit} from "./components/card-edit";
import {createCardTemplate} from "./components/card-template";
import {createBoardTemplate} from "./components/board";
import {getTask} from "./components/data";

const TASK_COUNT = 17;

const getDataTasks = () => {
  let arrayFilms = [];

  new Array(TASK_COUNT).fill(``).forEach(() => arrayFilms.push(getTask()));
  return arrayFilms;
};

const dataTasks = getDataTasks();

const countNavTasks = (attribute) => {
  let count = 0;

  dataTasks.forEach((item) => {
    if (item[attribute]) {
      count += 1;
    }
  });

  return count;
};

const navRepeat1 = () =>
  dataTasks.filter(
      (item) => Object.values(item.repeatingDays).includes(true)
  ).length;

const navAmountFavorite = countNavTasks(`isFavorite`);
const navAmountArchive = countNavTasks(`isArchive`);
const navAmountRepeat = navRepeat1();

const mainControl = document.querySelector(`.main__control`);
const main = document.querySelector(`.main`);
const wrapper = document.createElement(`div`);
wrapper.classList.add(`container`);

const renderComponent = (containerBox, component) => {
  containerBox.insertAdjacentHTML(`beforeend`, component);
};

renderComponent(mainControl, createSiteHeader());
renderComponent(main, createSiteSearch());
renderComponent(main, createFilter(dataTasks.length, navAmountFavorite, navAmountArchive, navAmountRepeat));
renderComponent(main, createBoardTemplate());

const boardElement = main.querySelector(`.board`);
const tasksContainer = main.querySelector(`.board__tasks`);

renderComponent(tasksContainer, createCardEdit(dataTasks[0]));

const renderTasks = (container, array) => {
  container.insertAdjacentHTML(`beforeend`, array.map(createCardTemplate).join(``));
};
const sliceTasks = (elFirst, elLast) => {
  return dataTasks.slice(elFirst, elLast);
};

renderTasks(tasksContainer, sliceTasks(1, 8));

renderComponent(boardElement, createLoadMoreButton());

const loadMore = document.querySelector(`.load-more`);

const TASK_ROW = 8;

let elFirst = 0;

const onButtonShowMore = () => {
  elFirst += TASK_ROW;
  let elLast = elFirst + TASK_ROW;
  const arraySliced = sliceTasks(elFirst, elLast);

  renderTasks(tasksContainer, arraySliced);

  if (arraySliced.length <= TASK_ROW - 1) {
    loadMore.style.display = `none`;
  }
};

loadMore.addEventListener(`click`, onButtonShowMore);

