new Canv('canvas', {
    width: 500,
    height: 500,
    speed: 0,
    setup() {
        // this.car = new ShapeGroup({
        //     tl_wheel: new Rect(this.halfWidth(30)-5, this.height-40, 10, 10),
        //     tr_wheel: new Rect(this.halfWidth(30)+25, this.height-40, 10, 10),
        //     br_wheel: new Rect(this.halfWidth(30)+25, this.height-10, 10, 10),
        //     bl_wheel: new Rect(this.halfWidth(30)-5, this.height-10, 10, 10),
        //     body_front: new Circle(this.halfWidth(), this.height-50, 15).setColor(new Color(99,11,184)),
        //     body: new Rect(this.halfWidth(30), this.height-50, 30, 50).setColor(new Color(99,11,184)),
        //     window_front: new Rect(this.halfWidth(20), this.height-40, 20, 20),
        //     window_front_arc: new Circle(this.halfWidth(), this.height-40, 10),
        //     roof: new Rect(this.halfWidth(20), this.height-30, 20, 20).setColor(new Color(149, 82, 215)),
        // });

        this.car = new Rect(50, this.halfHeight(30), 50, 30).setColor(new Color(99,11,184))
    },

    update() {
        if(this.keyDown("a")) {
            this.car.angle -= 4;
        }
        if(this.keyDown("d")) {
            this.car.angle += 4;
        }

        if(this.keyDown("w")) {
            this.speed = 4;
        } else {
            if(this.speed <= 4 && this.speed > 0) {
                this.speed -= 0.05;
            } else {
                this.speed = 0;
            }
        }
        this.car.x += this.speed * Math.cos(this.car.angle * Math.PI / 180);
        this.car.y += this.speed * Math.sin(this.car.angle * Math.PI / 180);
    },

    draw() {
        this.clear();
        // this.add(this.car);
    }
});