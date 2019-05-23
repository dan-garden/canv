new Canv('canvas', {
    setup() {
        class Slider extends ShapeGroup {
            constructor(x, y, w, h, min, max, step=1) {
                super({
                    handle: new Circle(x, y, h),
                    rail: new Rect(x, y-(h/2), w, h)
                });


                this.rail.addEventListener('mousedown', (canv) => {
                    const closest = canv.map(
                        canv.mouseX,
                        x, x+w,
                        min, max
                    );
                    
                    this.handle.x = canv.mouseX;
                })
            }

            get val() {
                return this.handle.x;
            }
        }

        this.slider = new Slider(100, 100, 100, 10, 0, 100, 5);
        this.slider.rail.color = "blue";
    },

    draw() {
        this.clear();
        this.add(this.slider);
    }
})