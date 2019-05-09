const fire = new Canv('canvas', {
    setup() {
        this.particles = new ShapeGroup();
        this.startSize = 30;
        this.density = 3;
        this.shrinkSpeed = 0.5;
        this.fadeSpeed = -3;
        this.moveSpeed = 2;

        this.minColor = new Color(200, 60, 0);
        this.maxColor = new Color(255, 100, 20);

        // this.minColor = Color.random();
        // this.maxColor = Color.random();

        this.background = 0;
    },

    randomize() {
        this.startSize = Canv.random(10, 50);
        this.density = Canv.random(1, 5);
        this.shrinkSpeed = Canv.random(0.1, 3);
        this.fadeSpeed = Canv.random(-3, 10);
        this.moveSpeed = Canv.random(1, 5);

        this.minColor = Color.random();
        this.maxColor = Color.random();

        return this.dopeness();
    },

    dopeness() {
        const dope = [
            //WHITE FIRE
            {"startSize":49,"density":5,"shrinkSpeed":1,"fadeSpeed": 6,"moveSpeed":2},
            //SMALL BUBBLING
            {"startSize":40,"density":5,"shrinkSpeed":3,"fadeSpeed":2,"moveSpeed":2},
            //LARGE FLAMESS^_^
            {"startSize":48,"density":2,"shrinkSpeed":1,"fadeSpeed":3,"moveSpeed":4}
        ];


        return JSON.stringify({
            startSize: this.startSize,
            density: this.density,
            shrinkSpeed: this.shrinkSpeed,
            fadeSpeed: this.fadeSpeed,
            moveSpeed: this.moveSpeed
        });
    },

    update() {
        if (this.frames % 200 === 0) {
            this.randomize();
        }

        for (let j = 0; j < this.density; j++) {
            const randY = Canv.random(1, 50);
            const randW = this.randomWidth;
            const particle = new Circle(
                randW,
                this.height + this.startSize + randY,
                Canv.random(this.startSize - 10, this.startSize + 10)
            );

            particle.color = new Color(
                Canv.random(this.minColor.r, this.maxColor.r),
                Canv.random(this.minColor.g, this.maxColor.g),
                Canv.random(this.minColor.b, this.maxColor.b)
            );
            this.particles.add(particle);
        }


        if (this.frames % this.moveSpeed === 0) {
            this.particles.forEach((particle, i) => {
                if (particle.radius <= 0 || (
                        particle.color.r <= this.background.r &&
                        particle.color.g <= this.background.g &&
                        particle.color.b <= this.background.b
                    )) {
                    this.particles.remove(i);
                } else {
                    particle.radius -= Canv.random(this.shrinkSpeed - 1, this.shrinkSpeed + 1);
                    if (particle.radius < 0) {
                        particle.radius = 0;
                    }
                    particle.setColor(particle.color.shade(this.fadeSpeed))
                }
            })
        }


        this.particles.moveY(-this.moveSpeed);
    },

    draw() {
        this.background = this.background;
        this.add(this.particles);
    }
})