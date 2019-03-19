new Canv('canvas', {
    x0: 0,
    y0: 0,
    x: 0,
    y: 0,
    t: 0,
    t_step: 1 / 20,
    tmp: 0,
    setup() {
        this.resize();
        window.addEventListener("resize", e => this.resize());
    },
    resize() {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight - 3;
    },
    rand(min, max) {
        const b = (max === 0 || max) ? max : 1,
            a = min || 0;
        return a + (b - a) * Math.random();
    },
    draw() {
        this.background = new Color(0, 0, 0);
        this.x0 = -1, this.y0 = this.height / 2;
        this.tmp = Math.pow(this.t, 1.75) / 19;
        for (this.x = 0; this.x < this.width; this.x = this.x + 3) {
            this.y = 9 * Math.sqrt(this.x) * Math.sin(this.x / 23 / Math.PI + this.t / 3 + Math.sin(this.x / 29 + this.t)) + 32 * Math.sin(this.t) * Math.cos(this.x / 19 + this.t / 7) + 16 * Math.cos(this.t) * Math.sin(Math.sqrt(this.x) + this.rand(3, 2) * this.tmp) + this.height / 2;
            let line = new ShapeGroup([
                new Line(this.x0, this.y0, this.x, this.y),
            ]);

            line.color = 'hsl(' + (2 * this.x / this.width + this.t) * 180 + ', 100%, 65%)';
            line.strokeWidth = 2;
            this.add(line);
            this.x0 = this.x;
            this.y0 = this.y;
        }
        this.t += this.t_step;
    }
});