const td = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.clicked = false;
        this.level = false;
        this.editor = false;
        this.playing = false;
        this.player = {
            speed: 1,
            lives: 100,
        };

        this.loadLevel(0);
    },

    loadLevel(id) {
        fetch(`levels/${id}/meta.json`)
            .then(result => result.json())
            .then(level => {
                this.level = level;
                this.setupLevel(id);
            })
    },

    setupLevel(id) {
        this.level.balloons = [];

        this.level.background = new Pic(
            `levels/${id}/${this.level.background}`,
            0, 0,
            977, 781
        );

        this.makePath();
        this.playing = true;
    },

    startLevel(id) {
        this.playing = true;
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
        for (let i = 0; i < this.level.path.length; i++) {
            if (i < this.level.path.length - 1) {
                const between = this.getPoints(
                    this.level.path[i][0], this.level.path[i][1],
                    this.level.path[i + 1][0], this.level.path[i + 1][1]
                );
                between.forEach(point => {
                    newPath.push(point);
                })
            }
        }
        this.level.path = newPath;
    },

    drawPath() {
        if(!this.pathLines) {
            this.pathLines = new ShapeGroup();
            for (let i = 0; i < this.level.path.length; i++) {
                if(i < this.level.path.length - 1) {
                    let line = new Line(
                        this.level.path[i][0], this.level.path[i][1],
                        this.level.path[i + 1][0], this.level.path[i + 1][1]);
                    this.pathLines.add(line);
                }
            }
        } else {
            this.add(this.pathLines);
        }
    },

    loseLife() {
        this.player.lives--;
        if(this.player.lives === 0) {
            this.playing = false;
        }
    },

    drawPlayerStats() {
        const lives = new Text(this.player.lives, 5, 20);
        lives.color = new Color(255);
        this.add(lives);
    },

    updateBalloons() {
        for (let i = this.level.balloons.length - 1; i >= 0; i--) {
            let balloon = this.level.balloons[i];
            balloon.i += this.player.speed;
            if (balloon.i >= this.level.path.length-1) {
                this.level.balloons.unshift();
                // console.log(balloon.i);
                // this.loseLife();
            } else {

                balloon.x = this.level.path[balloon.i][0];
                balloon.y = this.level.path[balloon.i][1];

                if(balloon.contains(this.mouseX, this.mouseY)) {
                    
                }
            }
        }
    },

    drawBalloons() {
        for (let i = 0; i < this.level.balloons.length; i++) {
            let balloon = this.level.balloons[i];
            if(this.level.path[balloon.i]) {
                this.add(balloon);
            }
        }
    },

    addBalloon() {
        let balloon = new Circle(this.level.path[0][0], this.level.path[0][1], 10);
            balloon.color = new Color(200, 0, 0);
            balloon.i = 0;
        this.level.balloons.push(balloon);
    },

    updateEditedPath() {
        if (this.mouseDown && !this.clicked) {
            this.clicked = true;

            this.level.path.push([this.mouseX, this.mouseY]);
            setTimeout(() => {
                this.clicked = false;
            }, 10);
        }
    },

    update() {
        if(this.playing) {
            this.updateBalloons();
    
            if(this.frames % 50 === 0) {
                this.addBalloon();
            }
            
            if(this.editor) {
                this.updateEditedPath();
            }
        }
    },

    draw() {
        if(this.playing) {
            this.clear();
            this.add(this.level.background);

            if(this.editor) {
                this.drawPath();
            }

            this.drawBalloons();
            this.drawPlayerStats();
        }
    }
})