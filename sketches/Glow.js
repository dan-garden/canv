new Canv('canvas', {
    draw() {
        this.background = new Color(0);
        this.bulb = new ShapeGroup();

        const size = 100;

        let color = new Color(255);
        for(let i = size; i >= 0; i--) {
            let circ = new Circle(
                this.halfWidth(),
                this.halfHeight(),
                i
            );

            circ.color = new Color(size-i);
            this.bulb.add(circ);
        }


        this.add(this.bulb);
    }
})