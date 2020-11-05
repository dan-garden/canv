const app = new Canv('canvas', {
    setup() {
        this.selection = false;
        this.selecting = false;
    },

    update() {
        if(this.mouseDown) {
            if(!this.firstPoint) {
                this.firstPoint = new Vector(this.mouseX, this.mouseY);
            }

            if(this.firstPoint) {
                this.points = [this.firstPoint, new Vector(this.mouseX, this.mouseY)];
            }
        }
    },

    draw() {
        this.background = 0;
        if(this.selection) {
            this.add(this.selection);
        }
    }
})