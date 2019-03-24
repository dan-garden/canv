new Canv('canvas', {
    x: 100,
    y: 100,
    w: 100,
    h: 100,
    setup() {
        this.resize();
        window.addEventListener("resize", e => this.resize());
    },
    resize() {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight - 3;
    },
    draw() {
        this.clear();
        const cube = new ShapeGroup([
            new Rect(this.x, this.y, this.w, this.h),
            new Rect(this.x+(this.w/2), this.y+(this.h/2), this.w, this.h),

            new Line(this.x, this.y, this.x+(this.w/2), this.y+(this.h/2)),
            new Line(this.x+this.w, this.y+this.h, this.x+this.w+(this.w/2), this.y+this.h+(this.h/2)),
            new Line(this.x+this.w, this.y, this.x+(this.w/2)+this.w, this.y+(this.h/2)),
            new Line(this.x, this.y+this.h, this.x+(this.w/2), this.y+(this.h/2)+this.h)
        ]);

        cube.color = "orange";
        cube.stroke = "orange";
        cube.noFill();

        this.add(cube);
    }
});