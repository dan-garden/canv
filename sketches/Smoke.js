const fire = new Canv('canvas', {
    setup() {
        this.particles = new ShapeGroup();
        this.defaultSize = 30;
        this.density = 3;
        this.shrinkSpeed = 0.5;
        this.fadeSpeed = -3;
        this.moveSpeed = 2;
    },

    update() {
            for(let j = 0; j < this.density; j++) {
                const randY = Canv.random(1, 50);
                const randW = this.randomWidth;
                const particle = new Circle(
                    randW,
                    this.height+this.defaultSize+randY,
                    Canv.random(this.defaultSize-10, this.defaultSize+10)
                );

                particle.color = new Color(
                    Canv.random(200, 255),
                    Canv.random(60, 100),
                    Canv.random(0, 20)
                );
                this.particles.add(particle);
            }


        if(this.frames % 2 === 0) {
            this.particles.forEach((particle, i) => {
                if(particle.radius <= 0 ||(
                    particle.color.r <= 0 &&
                    particle.color.g <= 0 &&
                    particle.color.b <= 0
                )) {
                    this.particles.remove(i);
                } else {
                    particle.radius -= this.shrinkSpeed;
                    particle.setColor(particle.color.shade(this.fadeSpeed))
                }
            })
        }

        
        this.particles.moveY(-this.moveSpeed);
    },

    draw() {
        this.background = 255;
        this.add(this.particles);
    }
})