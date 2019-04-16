new Canv('canvas', {
    fullscreen: true,
    Cell: class extends Rect {
        constructor(x, y, w, h) {
            super(x, y, w, h);
        }
    },
    setup() {

        this.cellsize = 20;
        this.move = 1;
        
    },
    update() {
        if(this.keyDown) {
            if(this.keyDown === "d") {
                this.cell.x += this.move;
            } else if(this.keyDown === "s") {
                this.cell.y += this.move;
            } else if(this.keyDown === "a") {
                this.cell.x -= this.move;
            } else if(this.keyDown === "w") {
                this.cell.y -= this.move;
            }
        }

        if(this.cell.x > this.width+this.cell.width) {
            this.cell.x = -this.cell.width;
        } else if(this.cell.x < -this.cell.width) {
            this.cell.x = this.width+this.cell.width;
        }

        if(this.cell.y > this.height+this.cell.height) {
            this.cell.y = -this.cell.height;
        } else if(this.cell.y < -this.cell.height) {
            this.cell.y = this.height+this.cell.height;
        }

    },
    draw() {
        this.clear();
        this.add(this.cell);
    }
});