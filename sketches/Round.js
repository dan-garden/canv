class Morph {
    constructor(shape, morphConfig) {
        this.shape = shape;

        Object.keys(morphConfig).forEach(k => {
            this[k] = morphConfig[k];
        });
        
    }

    update() {
        if(this.val <= this.min) {
            this.change = this.speed;
        } else if(this.val > this.max) {
            this.change = -this.speed;
        }
        this.val += this.change;
        eval(`this.shape.${this.alter} = this.val<this.min?this.min:this.val`);
    }

    render(canv) {
        this.shape.render(canv);
    }
}


const round = new Canv('canvas', {
    setup() {

        this.morph = new Morph(new Circle(100, 100, 30).setColor(255), {
            alter: "x",
            val: 0,
            min: 0,
            max: this.width,
            speed: 10,
            change: 0.1
        })
    },

    update() {
        this.morph.update();
    },

    draw() {
        this.background = 0;
        this.add(this.morph);
    }
})