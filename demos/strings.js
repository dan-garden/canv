const app = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.canvas.addEventListener("click", () => {
            console.log(this.mouseX, this.mouseY);
        });

        this.topY = 0;
        this.topW = 100;

        this.botY = this.height;
        this.botW = this.width;

        this.xCount = 10;

        
        this.keyframe(this, {topW: -this.width}, 3000, "outElastic");
    },

    update() {
        // this.topW++;
        // this.topY++;
        // this.botY--;
        // this.botW--

        this.topLine = new Line(
            new Vector(this.halfWidth() - (this.topW / 2), this.topY),
            new Vector(this.halfWidth() + (this.topW / 2), this.topY)
        );

        this.botLine = new Line(
            new Vector(this.halfWidth() - (this.botW / 2), this.botY),
            new Vector(this.halfWidth() + (this.botW / 2), this.botY)
        );

        this.xJoiningLines = new ShapeGroup();
        
        for(let i = 0; i < this.xCount+1; i++) {

            let topX = this.topLine.x + ((this.topW / this.xCount) * i);
            let topY = this.topY;
            let lineTop = new Vector(topX, topY);

            let botX = this.botLine.x + (this.botW / this.xCount) * i;
            let botY = this.botY;
            let lineBot = new Vector(
                botX,
                botY
            );

            let xJoiner = new Line(lineTop, lineBot);
            this.xJoiningLines.add(xJoiner);
        }
    },

    draw() {
        this.clear();
        this.add(this.topLine);
        this.add(this.xJoiningLines);
        this.add(this.botLine);
    },
})