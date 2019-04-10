const td = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.clicked = false;

        this.speed = 1;
        this.bg = new Pic(
            "images/BTDMap.webp",
            0, 0,
            this.width, this.height
        );

        this.balloons = [];

        this.makePath();
    },

    getPoints(x1, y1, x2, y2) {
        var coordinatesArray = new Array();
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        coordinatesArray.push([x1, y1]);
        while (!((x1 == x2) && (y1 == y2))) {
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
            coordinatesArray.push([x1, y1]);
        }
        return coordinatesArray;
    },

    makePath() {
        const newPath = [];
        for (let i = 0; i < this.path.length; i++) {
            if (i < this.path.length - 1) {
                const between = this.getPoints(
                    this.path[i][0], this.path[i][1],
                    this.path[i + 1][0], this.path[i + 1][1]
                );
                between.forEach(point => {
                    newPath.push(point);
                })
            }
        }
        this.path = newPath;
    },

    drawPath() {
        for (let i = 0; i < this.path.length; i++) {
            if (i < this.path.length - 1) {
                let line = new Line(
                    this.path[i][0], this.path[i][1],
                    this.path[i + 1][0], this.path[i + 1][1]);
                this.add(line);
            }
        }
    },

    addBalloon() {
        let balloon = new Circle(0, 0, 10);
            balloon.color = new Color(200, 0, 0);
            balloon.i = 0;
        this.balloons.push(balloon);
    },

    update() {
        for (let i = this.balloons.length - 1; i >= 0; i--) {
            let balloon = this.balloons[i];
            balloon.i += this.speed;
            if (balloon.i > this.path.length-1) {
                this.balloons.unshift();
            } else {
                if(balloon.contains(this.mouseX, this.mouseY)) {
                    console.log(balloon);
                } else {
                    balloon.x = this.path[balloon.i][0];
                    balloon.y = this.path[balloon.i][1];
                }
            }
        }

        if(this.frames % 50 === 0) {
            this.addBalloon();
        }
        // this.enableCustomPath();
    },

    enableCustomPath() {
        if (this.mouseDown && !this.clicked) {
            this.clicked = true;

            this.path.push([this.mouseX, this.mouseY]);

            setTimeout(() => {
                this.clicked = false;
            }, 10);
        }
    },

    draw() {
        this.clear();
        this.add(this.bg);
        for (let i = 0; i < this.balloons.length; i++) {
            let balloon = this.balloons[i];
            if(this.path[balloon.i]) {
                this.add(balloon);
            }
        }
    }
})