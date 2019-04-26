new Canv('canvas', {
    setup() {
        cmd.popup = class {
            constructor(title, body) {
                this.title = title;
                this.body = body;

                this.build();
                this.show();
            }

            build() {
                const container = document.createElement('div');
                const title = document.createElement('h1');
                const body = document.createElement('div');

                container.appendChild(title);
                container.appendChild(body);

                container.position = "fixed";
                container.width = "100%";
                container.height = "100%";
                container.zIndex = 100;
                container.style.display = "none";


                this.dom = container;
                document.body.appendChild(this.dom);
            }

            hide() {
                this.dom.style.display = "none";
            }

            show() {
                this.dom.style.display = "block";
            }
        }
    }
})