const road = new Canv('canvas', {
    fullscreen: true,
    speed: 0,
    maxSpeed: 10,
    setup() {
        this.car = new Pic (
            "images/car.jpg",
            50, this.halfHeight(30),
            50, 30
        ).setColor(new Color(99,11,184))

        this.track = new ShapeGroup;
    },

    update() {
        if(this.keyDown("a")) {
            if(this.speed > 0) this.car.rotate(-4);
        }
        if(this.keyDown("d")) {
            if(this.speed > 0) this.car.rotate(4);
        }

        if(this.keyDown("w")) {
            if(this.speed < this.maxSpeed) {
                this.speed += 0.3;
            }
        } else {
            if(Math.floor(this.speed) <= this.maxSpeed && this.speed > 0) {
                this.speed -= 0.05;
            } else {
                this.speed = 0;
            }
        }
        

        this.car.x += this.speed * Math.cos(this.car.angle * Math.PI / 180);
        this.car.y += this.speed * Math.sin(this.car.angle * Math.PI / 180);
    },

    draw() {
        // this.clear();
        this.background = new Color(255);
        this.add(this.car);
    }
});