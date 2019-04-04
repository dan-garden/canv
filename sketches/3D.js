const note = new Canv('canvas', {
    width: 300,
    height: 300,
    move: 0,
    setup() {      
        this.pyramid = new ShapeGroup([
            new Triangle(0,230,250,100,0,220),
            new Triangle(100,0,0,230,0,220),
            new Triangle(100,0,250,100,0,220)
        ]);

        this.pyramid.noFill();
        this.moveMax = this.width * 2;
    },

    update() {
        this.move++;
        this.pyramid.moveY((this.move % this.moveMax >= (this.moveMax/2)) ? -1 : 1)
    },

    draw() {
        this.clear();
        this.add(this.pyramid);
    }
})