const tiled = new Canv('canvas', {
    width: 400,
    height: 300,
    setup() {
        this.pixels = false;
        this.every = 2;
        this.size = 5;
        const img = new Pic("images/test.jpg", 0, 0, this.width, this.height, img => {
            this.add(img);
            // this.pixels = this.getPixels();
            // this.invert();
        });
    },


    update() {
        if(this.mouseDown) {
            this.filterPixels((color, x, y) => {
                if(x < this.mouseX+this.size && x > this.mouseX-this.size &&
                    y < this.mouseY+this.size && y > this.mouseY-this.size) {
                    return color.invert();
                } else {
                    return color;
                }
            })
        }
    },

    // draw() {
    //     this.add(this.px);
    // }
})

