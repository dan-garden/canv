const spinner = new Canv('canvas', {
    setup() {
        
        this.spinner = new ShapeGroup();
        this.config();
        this.build();
    },
    
    config() {
        this.points = Canv.random(1, 100);
        this.speed = Canv.random(1, 50);
        this.size = Canv.random(50, 500);
        this.thickness = Canv.random(1, 20);
        this.color = Color.random();
    },
    
    build() {
        this.spinner.clear();
        for(let i = 0; i < this.points; i++) {
            let angle = (180 / this.points) * i;
            const rect = new Rect(
                this.halfWidth(this.thickness),
                this.halfHeight(this.size),
                this.thickness,
                this.size
            ).setColor(this.color).setAngle(angle);
    
            this.spinner.add(rect);
        }
    },

    update() {
        if(this.frames % 20 === 0) {
            this.config();
            this.build();
        }
        this.spinner.setColor(this.color);
        this.spinner.rotate(this.speed);
    },

    draw() {
        this.background = 255;
        this.add(this.spinner)
    }
})