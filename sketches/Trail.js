const trail = new Canv('canvas', {
    setup() {
        // this.background = 0;
        this.count = 1;
        // this.colors = new Array(4).fill(Color.random())
        // this.colors = [
        //     new Color(255, 0, 0),
        //     new Color(0, 255, 0),
        //     new Color(255, 0, 255),
        //     new Color(0, 0, 255)
        // ];
        this.colors = [Color.random(), Color.random(), Color.random(), Color.random()]
    },

    update() {
        if(this.frames % 10 === 0) {
            this.colors = [Color.random(), Color.random(), Color.random(), Color.random()]
        }
        this.count = (this.count + 0.01) % 100
    },

    draw() {
        this.background = 0;
        let count = this.count;
        for(let i = 0; i < count; i++) {
            let dist1 = (this.width / count * i) + ((this.width / count) / 2);
            let dist2 = (this.height / count * i) + ((this.height / count) / 2);
            const line1 = new Line(
                new Vector(dist1, this.height),
                new Vector(this.width, this.height-dist2)
            );
            line1.color = this.colors[0];
            this.add(line1);


            const line2 = new Line(
                new Vector(this.width - dist1, this.height),
                new Vector(0, this.height - dist2)
            );
            line2.color = this.colors[1];
            this.add(line2);

            const line3 = new Line(
                new Vector(0, dist2),
                new Vector(this.width-dist1, 0)
            );
            line3.color = this.colors[2];
            this.add(line3);


            const line4 = new Line(
                new Vector(this.width-dist1, 0),
                new Vector(this.width, this.height-dist2)
            );
            line4.color = this.colors[3];
            this.add(line4);
        }
    }
})