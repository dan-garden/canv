const star = new Canv('canvas', {
    setup() {
        this.size = 10;
    },

    update() {
        // this.size++;
    },

    draw() {
        this.background = 255;
        const centerX = this.halfWidth();
        const centerY = this.halfHeight();

        const points = [
            new Vector(centerX - (this.size/2), centerY + (this.size/2)),
            new Vector(centerX, centerY - (this.size/2)),
            new Vector(centerX + (this.size/2), centerY + (this.size/2)),
            new Vector(centerX - (this.size/2), centerY - (this.size/4)),
            new Vector(centerX + (this.size/2), centerY - (this.size/4))
        ]


        const lines = [
            new Line(points[0], points[1]),
            new Line(points[1], points[2]),
            new Line(points[2], points[3]),
            new Line(points[3], points[4]),
            new Line(points[4], points[0])
        ];


        for(let i = 0; i < lines.length; i++) {
            this.add(lines[i]);
        }
    }

})