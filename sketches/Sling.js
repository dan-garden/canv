const sling = new Canv('canvas', {
    setup() {
        this.scene = new ShapeGroup();
        this.sceneAccel = 0;

        
    },

    addDots() {
        const r = 10;
        const xr = this.width + (r / this.sceneAccel);
        const x = Canv.random(xr, xr + 10);
        const y = Canv.random(-r, this.height + r);

        const s = new Circle(x, y, r);
        s.color = Color.random();

        this.scene.add(s);
    },

    updateDots() {
        this.scene.forEach((shape, i) => {
            if (shape.x < -(this.width * 3)) {
                this.scene.remove(i);
            }
        })

        this.scene.moveX(-this.sceneAccel);
    },

    update() {
        this.addDots();

        if(this.keyDown("a")) {
            this.sceneAccel -= 1;
        }

        if(this.keyDown("d")) {
            this.sceneAccel += 1;
        }


        this.updateDots();
    },

    draw() {
        this.clear();
        this.add(this.scene);
    }
})