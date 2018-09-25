"use strict";
(() => {
    const templateHTML = `
        <style>

        </style>
        <div class="card-container">

        </div>
    `;
    let template = document.createElement('template');
    template.innerHTML = templateHTML;
    class XCardElement extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: 'open' });
            let clone = document.importNode(template.content, true);
            shadowRoot.appendChild(clone);
        }
    }
    customElements.define('x-card', XCardElement);
})();
