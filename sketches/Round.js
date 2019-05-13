class Morph {
    constructor(shape, morphConfigs) {
        this.shape = shape;
        this.configs = morphConfigs.map(config => {
            return {
                val: config.min,
                ...config
            }
        });
    }

    update() {
        this.configs.forEach(config => {
            if(config.val <= config.min) {
                config.step = config.speed;
            } else if(config.val > config.max) {
                config.step = -config.speed;
            }
            config.val += config.step;
            eval(`this.shape.${config.alter} = config.val<config.min?config.min:config.val`);
        })
    }

    render(canv) {
        this.shape.render(canv);
    }
}


const round = new Canv('canvas', {
    setup() {

        this.morph = new Morph(new Circle(this.halfWidth(),this.halfHeight(),30).setColor(255), [
            {
                
            }
        ])
    },

    update() {
        this.morph.update();
    },

    draw() {
        this.background = 0;
        this.add(this.morph);
    }
})