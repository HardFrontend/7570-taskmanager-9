import {Position, render} from "./components/utils";
import {Header} from "./components/site-header";
import {HeaderSearch} from "./components/site-search";
import {getTask} from "./components/data";
import {PageController} from "./controllers/board-controller";
import {HeaderFilter} from "./components/header-filter";

const TASK_COUNT = 11;

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

const pageController = new PageController(main, dataTasks);
pageController.init();

