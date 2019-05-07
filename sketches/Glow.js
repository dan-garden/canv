const glow = new Canv('canvas', {
    setup() {
        this.size = 1000;
        this.spread = 100;
        this.x = this.halfWidth(),
        this.y = this.halfHeight();
        
        this.light = new Circle(this.halfWidth(), this.halfHeight(), 50);
    },
    
    update() {
        this.light.color = new Color(255);
        this.light.setPos(this.mouseX, this.mouseY);
    },


    draw() {
        this.background = 0;
        
        this.bulb = new ShapeGroup();
        const radius = this.size / 2;
        const count = radius / this.spread;

        for(let i = this.spread; i >= 0; i--) {
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
        // this.add(this.light);
    }
})