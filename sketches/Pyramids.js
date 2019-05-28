new Canv('canvas', {
    setup() {
        this.pyramid = new ShapeGroup({
            casing_outer: new Triangle(),
            casing_inner: new Triangle(),

            chambers: new ShapeGroup({
                
            })
        });
    },

    draw() {
        this.add(this.pyramid);
    }
})