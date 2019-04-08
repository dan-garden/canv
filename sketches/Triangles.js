const game = new Canv('canvas', {
    fullscreen: true,
    s: 10,
    x: 100,
    y: 0,
    setup() {
        
    },

    update() {
        const s = this.s;
        const x = this.x;
        const y = this.y;


        this.pentagon = new ShapeGroup([
            new Triangle(
                x, y,
                x-(s), y+(s*3),
                x+(s), y+(s*3)
            ),
            new Triangle(
                x, y,
                x-(s*4), y+(s*3),
                x-(s), y+(s*3)
            ),
            new Triangle(
                x, y,
                x+(s*4), y+(s*3),
                x+(s), y+(s*3)
            ),

            new Triangle(
                x-(s*4), y+(s*3),
                x-(s), y+(s*3),
                x-(s*2), y+(s*5)
            ),

            new Triangle(
                x+(s*4), y+(s*3),
                x+(s), y+(s*3),
                x+(s*2), y+(s*5)
            )
        ]);
    },

    draw() {
        this.clear();
        this.add(this.pentagon);
    }
});