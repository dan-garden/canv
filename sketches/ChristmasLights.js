new Canv('canvas', {
    fullscreen: true,
    count: 10,
    on: true,
    Light: class Light {
        constructor(x, y, s, o, c) {
            const parts = [];
            const bulb = new Circle(x, y, s).setColor(c);
            parts.push(bulb);

            if(!o) {
                bulb.noFill();
            } else {
                const ref = new Circle(x+(s/3), y+(s/3), s/3).setColor(c.shade(50))
                parts.push(ref);
            }

            return new ShapeGroup(parts);
        }
    },

    setup() {
        // this.drawDelay = 20;
    },

    update() {
        this.lights = new ShapeGroup([]);

        for(let i = 0; i < this.count; i++) {
            const s = ((this.width/this.count)/2);
            const x = s + (i * s * 2);
            // const y = Canv.random(s+30, s+150);
            const y = 100;
            const c = Color.random();
            const l = new this.Light(x, y, s, this.on, c);
            this.lights.shapes.push(l);
        }
    },

    draw() {
        this.add(this.lights);
    }
});