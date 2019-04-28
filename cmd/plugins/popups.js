class Style {
    constructor(styles) {
        const sheet = document.createElement('style');
        sheet.innerHTML = styles;
        return sheet;
    }
}

new Canv('canvas', {
    setup() {
        document.head.appendChild(new Style(`
            .cli-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 100;
                display: none;
                text-align: center;
                color: ${cmd.colors.primary};
                background-color: ${cmd.colors.secondary};
                font-family: ${cmd.fontFamily};
            }

            .cli-popup textarea {
                width: 100%;
                max-width: 700px;
                height: 500px;
                border: solid 1px ${cmd.colors.primary};
                color: ${cmd.colors.primary};
                background: none;
                font-size: ${cmd.fontSize}px;
                padding: 5px;
            }

            .cli-popup button {
                background-color: ${cmd.colors.primary};
                color: ${cmd.colors.secondary};
                border: none;
                font-size: 16px;
                padding: 10px 25px;
            }

        `));

        cmd.popup = class {
            constructor(title, body) {
                this.title = title;

                this.body = body;
                this.build();
                this.open();
            }

            build() {
                this.dom = "";
                const container = document.createElement('div');
                const title = document.createElement('h1');
                const body = document.createElement('div');
                container.classList.add('cli-popup');

                title.innerHTML = this.title;


                body.innerHTML = "";
                if(!Array.isArray(this.body)) {
                    this.body = [this.body];
                }

                this.body.forEach(el => {
                    if(el instanceof HTMLElement) {
                        body.appendChild(el);
                    } else {
                        body.innerHTML += el;
                    }
                })

                container.appendChild(title);
                container.appendChild(body);

                this.dom = container;
                document.body.appendChild(this.dom);
            }

            close() {
                this.dom.style.display = "none";
                cmd.overlays.pop();
                this.dom.parentNode.removeChild(this.dom);
            }

            open() {
                this.dom.style.display = "block";
                cmd.overlays.push(this);
            }
        }
    }
})