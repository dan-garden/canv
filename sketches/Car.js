new Canv('canvas', {
    fullscreen: true,
    speed: 0,
    maxSpeed: 10,

    r: 5,

    carW: 50,
    carH: 30,

    setup() {
        this.car = new Pic (
            "images/car.jpg",
            this.carW, this.halfHeight(this.carH),
            this.carW, this.carH
        )

        this.track = new ShapeGroup;
    },

    update() {
        if(this.keyDown("a")) {
            if(this.speed !== 0) this.car.rotate(-this.r);
        }
        if(this.keyDown("d")) {
            if(this.speed !== 0) this.car.rotate(this.r);
        }

        if(this.keyDown("w")) {
            if(this.speed < this.maxSpeed) {
                this.speed += 0.1;
            }
        } else {
            if(this.keyDown("s") || Math.floor(this.speed) <= this.maxSpeed && this.speed > 0) {
                this.speed -= 0.05;
            } else {
                this.speed = 0;
            }
        }
        

        this.car.x += this.speed * Math.cos(this.car.angle * Math.PI / 180);
        this.car.y += this.speed * Math.sin(this.car.angle * Math.PI / 180);

        if(this.car.x > this.width+this.carW) {
            this.car.x = -this.carW;
        } else if(this.car.x < -this.carW) {
            this.car.x = this.width+this.carW;
        }

        if(this.car.y > this.height+this.carH) {
            this.car.y = -this.carH;
        } else if(this.car.y < -this.carH) {
            this.car.y = this.height+this.carH;
        }

        
    },

    draw() {
        // this.background = new Color(80);
        this.add(this.track);

        this.add(this.car);
    }
});