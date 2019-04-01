const game = new Canv('canvas', {
    width: 400,
    height: 400,
    gap: 100,
    Bird: class Bird extends ShapeGroup {
        constructor(x, y, birdSize) {
            super([]);
            this.birdSize = birdSize;

            this.body = new Circle(x, y, this.birdSize);
            this.body.color = "yellow";

            this.eye = new Circle(this.body.x, this.body.y-5, 3);

            this.beak = new Rect(x+10, y, 20, 10);
            this.beak.color = "orange";

            this.beakline = new Line(
                this.beak.x,
                this.beak.y + (this.beak.height / 2),
                this.beak.x + this.beak.width,
                this.beak.y + (this.beak.height / 2)
            );
            this.shapes = [this.body, this.eye, this.beak, this.beakline];
        }
    },
    Pipe: class Pipe extends ShapeGroup {
        constructor(type, height, canvWidth, canvHeight) {
            super([]);
            this.type = type;
            this.width = 50;
            this.height = height;
            this.x = canvWidth;
            this.y = this.type=="top"?0:canvHeight-this.height;

            this.main = new Rect(this.x, this.y, this.width, this.height);
            this.main.color = new Color(0, 200, 20);
            this.main.showStroke = true;

            this.lipwidth = 5;
            this.lipheight = 15;
            this.lip = new Rect(
                this.x-this.lipwidth,
                this.type=="top" ? this.height-this.lipheight : this.y,
                this.width+(this.lipwidth*2),
                this.lipheight
            );
            this.lip.color = new Color(0, 200, 20);
            this.lip.showStroke = true;

            this.shapes = [this.main, this.lip];
        }
    },
    setup() {
        this.bird = new this.Bird(20, this.halfHeight(30), 20);
        this.pipes = [];
    },

    update() {
        // if(this.keyDown === " ") {
        //     this.bird.moveY(-5);
        // } else {
        //     this.bird.moveY(3);
        // }
        
        if(this.frames === 1 || this.frames % 80 === 0) {
            this.gap = Canv.random(20, 150);

            const top = new this.Pipe("top", (this.height/2)-this.gap, this.width, this.height);
            const bottom = new this.Pipe("bottom", (this.height/2)-this.gap, this.width, this.height);
            this.pipes.push(top, bottom);
        }
        
        for(let i = this.pipes.length-1; i >= 0; i--) {
            if(this.pipes[i].shapes[0].x < -this.pipes[i].width) {
                this.pipes.splice(i, 1);
            } else {
                this.pipes[i].moveX(-2);
            }
        }
    },

    draw() {
        this.background = new Color(160, 210, 255);
        this.pipes.forEach(pipe => this.add(pipe));
        this.add(this.bird);
    }
})