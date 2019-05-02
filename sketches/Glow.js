const glow = new Canv('canvas', {
    setup() {
        this.size = 100;
        this.spread = 10;
        this.x = this.halfWidth(),
        this.y = this.halfHeight();
    },


    update() {
        // this.light.setPos(this.mouseX, this.mouseY)
        // this.size++;
    },



    draw() {
        this.background = new Color(0);

        this.bulb = new ShapeGroup();
        const radius = this.size / 2;
        const count = this.size / this.spread;

        for(let i = count; i >= 0; i--) {
            // const x = this.x * Math.PI / i;
            const x = this.x;
            const y = this.y;


            let circ = new Circle(x,y,i * (count));

            const range = [
                255 - ((255 / this.spread) * i)
            ];

            circ.color = new Color(...range);
            this.bulb.add(circ);
        }

        
        this.add(this.bulb);
    }
})