const app = new Canv('canvas', {
    setup() {
        this.selection = false;
    },

    update() {
        if(this.mouseDown) {
            if(!this.firstPoint) {
                this.firstPoint = new Vector(this.mouseX, this.mouseY);
            }

            if(this.firstPoint) {
                this.points = [this.firstPoint, new Vector(this.mouseX, this.mouseY)];

                this.selection = new Rect(
                    this.points[0].x,
                    this.points[0].y,
                    this.points[1].x - this.points[0].x,
                    this.points[1].y - this.points[0].y
                );

                this.selection.setColor();
            }
        } else {
            this.selection = false;
            this.points = false;
            this.firstPoint = false;
        }
    },

    draw() {
        this.background = 0;
        if(this.selection) {
            this.add(this.selection);
        }
    }
})