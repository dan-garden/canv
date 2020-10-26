const app = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.group = new ShapeGroup({
            shape1: new Rect(100, 50, 80, 40).setColor("blue"),
            shape2: new Triangle(100, 200, 150, 250, 100, 250).setColor("lime"),
        }).setPivot(10, 100);
    },

    update() {
        console.log(this.group.x, this.group.y)

    },

    draw() {
        this.clear();
        this.add(this.group);
    },
})