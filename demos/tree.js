const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,
    setup() {
        this.bgColor = new Color(154, 14, 72);
        // this.transition = 0.1;

        this.startDist = 150;
        this.distMulti = 1.2;
        this.maxCount = 10;
        this.angleInc = 0.4;
        
        this.dir = 1;
    },

    branch(line, i=0) {
        if(i >= this.maxCount) return;
        if(i === 0) {
            const line = new Line(this.width / 2, this.height, this.width / 2, this.height - this.startDist).setColor(255);
            line.dist = this.startDist;
            line.ang = 0;
            this.add(line);
            this.branch(line, i+1);
        } else {
            ["test", "same"].forEach((_, j) => {
                const startX = line.x2;
                const startY = line.y2;
                const dist = line.dist / this.distMulti;
                let angle = line.ang;
                if(j === 1) {
                    angle -= this.angleInc;
                } else {
                    angle += this.angleInc;
                }
                const endX = startX - Math.sin(angle) * dist;
                const endY = startY - Math.cos(angle) * dist;
                const newLine = new Line(startX, startY, endX, endY).setColor(255);
                newLine.dist = dist;
                newLine.ang = angle;
                this.add(newLine);
                this.branch(newLine, i+1);
            })
        }
    },

    runKeyframe() {
        if(this.dir === 1) {
            this.animate(this, {angleInc: 0.3}, Canv.random(5000, 10000), "inOutBack", this.runKeyframe);
            this.dir = 0;
        } else {
            this.animate(this, {angleInc: 0.4}, Canv.random(5000, 10000), "inOutBack", this.runKeyframe);
            this.dir = 1;
        }
    },

    keyframes() {
        this.runKeyframe();
    },

    draw() {
        this.background = this.bgColor;
        this.branch(false);
    }
});


// this.circ.setPos(
//     this.circ.x + Math.sin(this.angle) * this.dist,
//     this.circ.y + Math.cos(this.angle) * this.dist
// )