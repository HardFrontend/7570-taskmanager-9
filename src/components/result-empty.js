import {AbstractComponent} from "./abstract-component";

export class ResultEmpty extends AbstractComponent {
  getTemplate() {
    return `<section class="result container">
                <button class="result__back">back</button>

                 <section class="result__group">
                <h2 class="result__title">
                #work<span class="result__count"></span>
                </h2>
                <p class="result__empty">no matches found...</p>
                <div class="result__cards"></div>
                 </section>
             </section>
      `;
  }
}
