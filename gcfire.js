const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        this.circles = new ShapeGroup();
    },

    update() {
        if(this.frames % 1 === 0) {
            const size = Canv.random(5, 80);
            const circle = new Circle(this.randomWidth, this.height + size, size);
            circle.color = new Color(255);
            circle.moveSpeed = 5;
            circle.shrinkSpeed = 0.3;
            circle.fadeSpeed = 0.01;
            this.circles.add(circle);
        }

        this.circles.forEach((circle,  i) => {
            circle.y -= circle.moveSpeed;
            circle.color.a -= circle.fadeSpeed;
            circle.size -= circle.shrinkSpeed;
            if(circle.y <= -circle.size) {
                this.circles.remove(i);
            } else if(circle.size <= 0) {
                this.circles.remove(i);
            } else if(circle.color.a <= 0) {
                this.circles.remove(i);
            }
        });
    },

    draw() {
        this.background = new Color("#ED1556");
        this.add(this.circles);
    },
});