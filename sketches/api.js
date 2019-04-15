new Canv('canvas', {
    width: 300,
    height: 300,
    road: [],
    setup() {
        this.car = new ShapeGroup({
            body: new Rect(100, 100, 100, 30),
            left_wheel: new Circle(110, 130, 15).setColor("red"),
            right_wheel: new Circle(190, 130, 15).setColor("red")
        });
    },

    update() {
        // console.log(this.car.body);
    },

    draw() {
        this.clear();
        this.add(this.car);
    }
});