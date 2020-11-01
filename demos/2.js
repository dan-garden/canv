const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,
    setup() {
        this.transition = 1;
        this.bg = new Color("#1d1d1d");
        this.speed = 1;
        this.growSpeed = 5;
        this.fadeSpeed = 0.01;
        this.maxSize = 100;
        this.circles = new ShapeGroup();
    },

    update() {
        if(this.frames % this.speed === 0) {
            const circle = new Circle(this.randomWidth, this.randomHeight, 1);
            circle.color = Color.random().opacity(0.5);


            this.circles.add(circle);
        }

        this.circles.forEach((circle, i) => {
            circle.size += this.growSpeed;

            if(circle.size >= this.maxSize) {
                circle.color.a -= this.fadeSpeed;

                if(circle.color.a <= 0) {
                    this.circles.remove(i);
                }
            }
        })
    },

    draw() {
        this.background = this.bg;
        this.add(this.circles);
    },
});