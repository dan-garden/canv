const tiled = new Canv('canvas', {
    width: 150,
    height: 150,
    setup() {
        this.particles = new ShapeGroup();
        this.startSize = 10;
        this.density = 3;
        this.shrinkSpeed = 1;
        this.fadeSpeed = -3;
        this.moveSpeed = 2;

        this.minColor = new Color(200, 60, 0);
        this.maxColor = new Color(255, 100, 20);

        this.img = new Pic("images/test.jpg", 0, 0, this.width, this.height);

        this.drawDelay = 2;
        this.background = 0;
    },


    update() {
        for (let j = 0; j < this.density; j++) {
            const randY = Canv.random(1, 50);
            const randW = this.randomWidth;
            const particle = new Circle(
                randW,
                this.height + this.startSize + randY,
                Canv.random(this.startSize - (this.startSize / 2), this.startSize + (this.startSize / 2))
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
        this.add(this.img);
        if(this.img.loaded) {
            this.filterPixels((color, x, y) => {
                if(Canv.random(0, 1) === 0 && this.particles.contains(x, y)) {
                    return color.shade(-10);
                }

                return color;
            });
        }
        this.add(this.particles);
    }
})