const tiled = new Canv('canvas', {
    width: 400,
    height: 300,
    setup() {
        this.pixels = false;
        this.every = 2;
        this.size = 10;
        const img = new Pic("images/test.jpg", 0, 0, this.widthgit, this.height, img => {
            this.add(img);
        });
    },


    update() {
        if(this.mouseDown) {
            this.filterPixels((color, x, y) => {
                if(x < this.mouseX+this.size && x > this.mouseX-this.size &&
                    y < this.mouseY+this.size && y > this.mouseY-this.size) {
                    return color.shade(255);
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

