const glow = new Canv('canvas', {
    setup() {
        this.size = this.width;
        this.spread = 1;
        this.x = this.halfWidth(),
        this.y = this.halfHeight();
        
        this.light = new Circle(this.halfWidth(), this.halfHeight(), 10);
        this.light.color = Color.random();
        this.maxSpread = 100;
        this.moveInterval = 10;

    },
    
    update() {

        this.spread = (this.spread + 0.1) % this.maxSpread;
        if(this.frames % this.moveInterval === 0) {
            this.light.setPos(this.randomWidth, this.randomHeight);
        }        
    },


    draw() {
        this.background = 0;
        
        this.bulb = new ShapeGroup();
        const radius = this.size / 2;
        const count = radius / this.spread;

        // for(let i = this.spread; i >= 0; i--) {
            for(let i = 0; i < this.spread; i++) {
            // const x = this.x - i;
            const x = this.map(
                this.light.x,
                0, this.width,
                this.x - ((this.size * (this.spread - i))) / radius,
                this.x + ((this.size * (this.spread - i))) / radius,
                true
            );
            // const y = this.y;
            const y = this.map(
                this.light.y,
                0, this.height,
                this.y - ((this.size * (this.spread - i))) / radius,
                this.y + ((this.size * (this.spread - i))) / radius,
                true
            );

            const r = i * count;


            let circ = new Rect(x-(r/2),y-(r/2),r,r);

            const range = [
                this.light.color.r - ((this.light.color.r / this.spread) * i),
                this.light.color.g - ((this.light.color.g / this.spread) * i),
                this.light.color.b - ((this.light.color.b / this.spread) * i)
            ];
            
            circ.color = new Color(...range);
            if(i === this.spread) {
                circ.showStroke = true;
                // circ.stroke = new Color(circ.color.shade(20));
            }
            this.bulb.add(circ);
        }

        
        this.add(this.bulb);
        this.add(this.light);
    }
})