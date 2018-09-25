(() => {
    const templateHTML: string = `
        <style>
            :host {
                --card-size: 80px;
                --border-width: 3px;

                display: inline-block;
                margin: 4px;
            }
            .card-container {
                width: var(--card-size);
                height: var(--card-size);

                background-color: skyblue;
                border-bottom: var(--border-width) solid #566778;
                border-right: var(--border-width) solid #566778;
                border-radius: 4px;
                box-sizing: border-box;

                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            }
        </style>
        <div class="card-container"></div>
    `;

    let template = document.createElement('template');
    template.innerHTML = templateHTML;

    class XCardElement extends HTMLElement {

        static get observedAttributes() {
            return ['src', 'href', 'brand'];
        }

        private src: string;
        private href: string;
        private brand: string;
        private $$container: HTMLElement;

        constructor() {
            super();
            this.src = '';
            this.href = '';
            this.brand = '';

            let shadowRoot = this.attachShadow({ mode: 'open' });
            let clone = document.importNode(template.content, true);
            shadowRoot.appendChild(clone);

            this.$$container = shadowRoot.querySelector('.card-container') as HTMLElement;
        }

        attributeChangedCallback(name: string, oldvalue: string, newvalue: string) {
            switch(name) {
                case 'src':
                    if(newvalue !== oldvalue) { 
                        this.src = newvalue; 
                        (window as any).container = this.$$container;
                        this.$$container.style.backgroundImage = `url(${this.src})`;
                    }
                    break;
                case 'href':
                    if(newvalue !== oldvalue) { this.href = newvalue; }
                    break;
                case 'brand':
                    if(newvalue !== oldvalue) { this.brand = newvalue; }
                    break;
            }
        }
    }

    customElements.define('x-card', XCardElement)
})()