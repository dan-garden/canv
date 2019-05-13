const presets = [
    {name: "Original", "startSize":30,"density":3,"shrinkSpeed":0.5,"fadeSpeed":-3,"moveSpeed":2,"minColor":{"r":200,"g":60,"b":0,"a":1},"maxColor":{"r":255,"g":100,"b":20,"a":1}},
    {name: "White Fire", "startSize":49,"density":5,"shrinkSpeed":1,"fadeSpeed": 6,"moveSpeed":2},
    {name: "Small Bubbling", "startSize":40,"density":5,"shrinkSpeed":3,"fadeSpeed":2,"moveSpeed":2},
    {name: "Large Flames", "startSize":48,"density":2,"shrinkSpeed":1,"fadeSpeed":3,"moveSpeed":4},
    {name: "Icy Fire", "startSize":50,"density":5,"shrinkSpeed":1,"fadeSpeed":6,"moveSpeed":3,"minColor":{"r":95,"g":123,"b":200,"a":1},"maxColor":{"r":30,"g":198,"b":168,"a":1}},
    {name: "Small Yellow Fire", "startSize":49,"density":4,"shrinkSpeed":3,"fadeSpeed":7,"moveSpeed":3,"minColor":{"r":202,"g":212,"b":73,"a":1},"maxColor":{"r":178,"g":214,"b":14,"a":1}},
    {name: "Bubbles!", "startSize":10,"density":1,"shrinkSpeed":1,"fadeSpeed":-2,"moveSpeed":5,"minColor":{"r":58,"g":159,"b":239,"a":1},"maxColor":{"r":255,"g":250,"b":229,"a":1}},
    {name: "Pinky Blue Flames", "startSize":33,"density":4,"shrinkSpeed":1,"fadeSpeed":6,"moveSpeed":3,"minColor":{"r":227,"g":92,"b":227,"a":1},"maxColor":{"r":3,"g":81,"b":115,"a":1}},
    {name: "Pinky Firey Flames", "startSize":39,"density":4,"shrinkSpeed":1,"fadeSpeed":3,"moveSpeed":2,"minColor":{"r":160,"g":56,"b":98,"a":1},"maxColor":{"r":246,"g":74,"b":154,"a":1}},
    {name: "Purple Haze", "startSize":41,"density":4,"shrinkSpeed":1,"fadeSpeed":7,"moveSpeed":4,"minColor":{"r":172,"g":14,"b":214,"a":1},"maxColor":{"r":6,"g":53,"b":163,"a":1}},
    {name: "Purple Stagger", "startSize":50,"density":3,"shrinkSpeed":5,"fadeSpeed":5,"moveSpeed":5,"minColor":{"r":136,"g":69,"b":172,"a":1},"maxColor":{"r":110,"g":116,"b":231,"a":1}},
    {name: "Snowy Plains", "startSize":99,"density":2,"shrinkSpeed":1,"fadeSpeed":4,"moveSpeed":2,"minColor":{"r":91,"g":169,"b":112,"a":1},"maxColor":{"r":163,"g":223,"b":140,"a":1}},
    {name: "Pastel Clouds", "startSize":85,"density":5,"shrinkSpeed":2,"fadeSpeed":15,"moveSpeed":7,"minColor":{"r":57,"g":44,"b":110,"a":1},"maxColor":{"r":211,"g":163,"b":196,"a":1}},
    {name: "Electric Storm", "startSize":72,"density":9,"shrinkSpeed":2,"fadeSpeed":-10,"moveSpeed":4,"minColor":{"r":58,"g":77,"b":153,"a":1},"maxColor":{"r":7,"g":157,"b":245,"a":1}},
    {name: "Gravel Shower", "startSize":12,"density":10,"shrinkSpeed":2,"fadeSpeed":15,"moveSpeed":8,"minColor":{"r":101,"g":92,"b":30,"a":1},"maxColor":{"r":122,"g":112,"b":159,"a":1}},
    {name: "Smokey Barbie", "startSize":83,"density":6,"shrinkSpeed":3,"fadeSpeed":3,"moveSpeed":5,"minColor":{"r":239,"g":162,"b":252,"a":1},"maxColor":{"r":198,"g":31,"b":225,"a":1}},    
    {name: "Acid Rain", "startSize":75,"density":9,"shrinkSpeed":1,"fadeSpeed":1,"moveSpeed":9,"minColor":{"r":143,"g":124,"b":45,"a":1},"maxColor":{"r":139,"g":202,"b":43,"a":1}},
    {name: "Poison Gas Clouds", "startSize":64,"density":4,"shrinkSpeed":1,"fadeSpeed":-7,"moveSpeed":2,"minColor":{"r":69,"g":176,"b":141,"a":1},"maxColor":{"r":58,"g":140,"b":54,"a":1}},
    {name: "Emerald Flames", "startSize":42,"density":8,"shrinkSpeed":2,"fadeSpeed":-3,"moveSpeed":4,"minColor":{"r":11,"g":235,"b":147,"a":1},"maxColor":{"r":42,"g":218,"b":172,"a":1}}
];
const fire = new Canv('canvas', {
    setup() {
        this.particles = new ShapeGroup();
        this.startSize = 30;
        this.density = 3;
        this.shrinkSpeed = 0.5;
        this.fadeSpeed = -3;
        this.moveSpeed = 2;

        this.minColor = new Color(200, 60, 0);
        this.maxColor = new Color(255, 100, 20);

        this.presetIndex = -1;
        this.background = 0;

        this.randomize();
    },

    randomize() {
        console.clear();
        this.startSize = Canv.random(1, 100);
        this.density = Canv.random(1, 10);
        this.shrinkSpeed = Canv.random(0.1, 5);
        this.fadeSpeed = Canv.random(-10, 20);
        this.moveSpeed = Canv.random(1, 9);

        this.minColor = Color.random();
        this.maxColor = Color.random();

        return this.dopeness();
    },

    loadPreset(preset) {
        Object.keys(preset).forEach(key => {
            this[key] = preset[key];
        })

        console.log(preset.name);
    },


    nextPreset() {
        this.presetIndex = (this.presetIndex + 1) % presets.length;
        this.loadPreset(presets[this.presetIndex]);
    },


    dopeness() {
        return JSON.stringify({
            startSize: this.startSize,
            density: this.density,
            shrinkSpeed: this.shrinkSpeed,
            fadeSpeed: this.fadeSpeed,
            moveSpeed: this.moveSpeed,
            minColor: this.minColor,
            maxColor: this.maxColor
        });
    },

    update() {
        if (this.frames % 200 === 0) {
            this.nextPreset();
        }

        for (let j = 0; j < this.density; j++) {
            const randY = Canv.random(1, 50);
            const randW = this.randomWidth;
            const particle = new Circle(
                randW,
                this.height + this.startSize + randY,
                Canv.random(this.startSize - 10, this.startSize + 10)
            );

            particle.color = new Color(
                Canv.random(this.minColor.r, this.maxColor.r),
                Canv.random(this.minColor.g, this.maxColor.g),
                Canv.random(this.minColor.b, this.maxColor.b)
            );
            this.particles.add(particle);
        }


        if (this.frames % this.moveSpeed === 0) {
            this.particles.forEach((particle, i) => {
                if (particle.radius <= 0 || (
                        particle.color.r <= this.background.r &&
                        particle.color.g <= this.background.g &&
                        particle.color.b <= this.background.b
                    )) {
                    this.particles.remove(i);
                } else {
                    particle.radius -= Canv.random(this.shrinkSpeed - 1, this.shrinkSpeed + 1);
                    if (particle.radius < 0) {
                        particle.radius = 0;
                    }
                    particle.setColor(particle.color.shade(this.fadeSpeed))
                }
            })
        }


        this.particles.moveY(-this.moveSpeed);
    },

    draw() {
        this.background = this.background;
        this.add(this.particles);
    }
})