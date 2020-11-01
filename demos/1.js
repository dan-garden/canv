const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        // this.count = Math.floor(this.width/2);
        this.count = 100;
        this.size = 10;
        this.speed = 2;
        // this.color = Color.random();
        this.color = Color.random();
        this.bg = new Color("#1d1d1d");
        this.transition = 0.1;

        this.web = new ShapeGroup({
            dots: new ShapeGroup(),
            lines: new ShapeGroup()
        });

        for (let i = 0; i < this.count; i++) {
            const pos = new Vector(this.randomWidth, this.randomHeight);
            const dot = new Circle(pos.x, pos.y, this.size, this.size);
            const dir = new Vector(this.randomFloat(), this.randomFloat());
            dot.dir = dir;
            const line = new Line(0, 0, 0, 0);

            this.web.dots.add(dot);
            this.web.lines.add(line);
        }
    },

    randomFloat() {
        return (Math.random() < 0.5 ? Math.random() : -Math.random()) * this.speed;
    },

    update() {
        for (let i = 0; i < this.count; i++) {
            const curIndex = i;
            const nextIndex = i === this.count - 1 ? 0 : i + 1;

            const currentDot = this.web.dots.shapes[curIndex];
            const nextDot = this.web.dots.shapes[nextIndex];
            const currentLine = this.web.lines.shapes[curIndex]
            currentDot.pos.add(currentDot.dir);

            if(currentDot.x + currentDot.dir.x > this.width-currentDot.size || currentDot.x + currentDot.dir.x < currentDot.size) {
                currentDot.dir.x = -currentDot.dir.x;
            }
            if(currentDot.y + currentDot.dir.y > this.height-currentDot.size || currentDot.y + currentDot.dir.y < currentDot.size) {
                currentDot.dir.y = -currentDot.dir.y;
            }

            if(currentDot.contains(this.mouseX, this.mouseY)) {
                currentDot.size = 20;
            } else {
                currentDot.size = this.size;
            }

            currentLine.x1 = currentDot.x;
            currentLine.y1 = currentDot.y;
            currentLine.x2 = nextDot.x;
            currentLine.y2 = nextDot.y;

            currentLine.setColor(new Color(this.color).shade(100));
            currentDot.setColor(this.color);
        }
    },

    draw() {
        this.background = this.bg;
        this.add(this.web);
    },
});