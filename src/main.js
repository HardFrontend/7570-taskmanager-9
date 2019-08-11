import {createSiteHeader} from "./components/site-header";
import {createSiteSearch} from "./components/site-search";
import {createFilter} from "./components/filter";
import {createLoadMoreButton} from "./components/load-more-button";
import {createCardEdit} from "./components/card-edit";
import {createCardTemplate} from "./components/card-template";
import {createBoardTemplate} from "./components/board";

const mainControl = document.querySelector(`.main__control`);
const main = document.querySelector(`.main`);
const wrapper = document.createElement(`div`);
wrapper.classList.add(`container`);

const renderComponent = (containerBox, component) => {
  containerBox.insertAdjacentHTML(`beforeend`, component);
};

renderComponent(mainControl, createSiteHeader());
renderComponent(main, createSiteSearch());
renderComponent(main, createFilter());
renderComponent(main, createBoardTemplate());

const boardElement = main.querySelector(`.board`);
const taskListElement = main.querySelector(`.board__tasks`);

renderComponent(taskListElement, createCardEdit());

new Array(3).fill(``).forEach(() => renderComponent(taskListElement, createCardTemplate()));

renderComponent(boardElement, createLoadMoreButton());
