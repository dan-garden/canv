new Canv('canvas', {
    setup() {
        this.resize();
        window.addEventListener("resize", e => this.resize());
    },
    resize() {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight - 3;
    },
    draw() {
        if(this.mouseDown) {
            let line = new Line(
                this.mousePrevX,
                this.mousePrevY,
                this.mouseX,
                this.mouseY
            );

            line.width = 2;

            this.add(line);
        }
    }
});