const c = new Canv('canvas', {
    setup() {
        this.resize();
        window.addEventListener("resize", e => this.resize());
    },
    cube(x, y, w, h) {
        const w2=w/2,h2=h/2;
        const faces = [];

        const corner1 = new Vector(x, y);
        const corner2 = new Vector(x+w, y);
        const corner3 = new Vector(x+w, y+h);
        const corner4 = new Vector(x, y+h);

        const corner5 = new Vector(x+w2, y+h2);
        const corner6 = new Vector(x+w+w2, y+h2);
        const corner7 = new Vector(x+w+w2, y+h+h2);
        const corner8 = new Vector(x+w2 , y+h+h2);

        //BACK
        faces.push(new ShapeGroup([
            new Line(corner1, corner2),
            new Line(corner2, corner3),
            new Line(corner3, corner4),
            new Line(corner4, corner1)
        ]));

        //FRONT
        faces.push(new ShapeGroup([
            new Line(corner5, corner6),
            new Line(corner6, corner7),
            new Line(corner7, corner8),
            new Line(corner8, corner5)
        ]));

        //LEFT
        faces.push(new ShapeGroup([
            new Line(corner1, corner5),
            new Line(corner5, corner8),
            new Line(corner8, corner4),
            new Line(corner4, corner1)
        ]));

        //RIGHT
        faces.push(new ShapeGroup([
            new Line(corner3, corner2),
            new Line(corner2, corner6),
            new Line(corner6, corner7),
            new Line(corner7, corner3)
        ]));

        //TOP
        faces.push(new ShapeGroup([
            new Line(corner1, corner2),
            new Line(corner2, corner6),
            new Line(corner6, corner5),
            new Line(corner5, corner1)
        ]));
        
        //BOTTOM
        faces.push(new ShapeGroup([
            new Line(corner4, corner3),
            new Line(corner3, corner7),
            new Line(corner7, corner8),
            new Line(corner8, corner4),
        ]));

        return new ShapeGroup(faces);
    },
    resize() {
        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight - 3;
    },
    update() {
        
    },
    draw() {
        this.clear();


        this.add(new ShapeGroup(cells));
    }
});