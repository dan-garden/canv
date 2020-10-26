const app = new Canv('canvas', {
    fullscreen: true,

    setup() {
        this.previewSize = 10;
        this.previewPixels = 20;

        this.pic = false;
        this.hoverColor = false;
        this.setImage("demos/demo.png");
        this.preview = false;

        this.canvas.addEventListener("click", e => {
            console.log(this.hoverColor, this.hoverColor.toHex());
        });
    },

    setImage(url) {
        this.pic = new Pic(url, 0, 0);
    },

    getPixelPreview(pixels, x, y) {
        const size = this.previewSize;
        const preview = new ShapeGroup();
        for(let i = 0; i < pixels.length; i++) {
            for(let j = 0; j < pixels[0].length; j++) {
                const color = pixels[j][i];
                const pos = new Vector(
                    x + (i * size) - (size / 2),
                    y + (j * size) - (size / 2)
                );
                const rect = new Rect(pos.x, pos.y, size, size).setColor(color);
                rect.setStroke(1, 1)
                preview.add(rect);
            }
        }

        return preview;
    },

    update() {
        if (this.pic) {
            const correctPixel = this.getPixels(this.mouseX, this.mouseY, 1, 1);
            this.hoverColor = correctPixel[0][0];
        }
    },

    draw() {
        if (this.hoverColor) {
            this.background = this.hoverColor;
        }

        if (this.pic) {
            this.add(this.pic);
        }

        if (this.mouseX && this.mouseY) {
            const pixels = this.getPixels(this.mouseX, this.mouseY, this.previewPixels, this.previewPixels);
            this.preview = this.getPixelPreview(pixels, this.mouseX-(this.previewPixels * this.previewSize / 2), this.mouseY-(this.previewPixels * this.previewSize / 2));
        }


        if(this.preview) {
            this.add(this.preview);
        }
    },

});