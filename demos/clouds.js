const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,
    
    setup() {
        this.cloudColor = new Color(255).shade(-10);
        this.clouds = new ShapeGroup();
    },

    getCloud(startX=0, startY=0) {
        const startPoint = new Vector(startX, startY);
        const startSize = Canv.random(30, 40);
        const anchorPuff = new Circle(startPoint.x, startPoint.y, startSize).setColor(this.cloudColor);

        const puffs = {anchor: anchorPuff, puffs: new ShapeGroup};

        for(let i = 0; i < Canv.random(2, 1000); i++) {
            const size = Canv.random(startSize * 0.3, startSize * 0.8);
            const point = new Vector(startPoint.x + Canv.random(-(size * 1.5), (size * 1.5)), startPoint.y + Canv.random(-(size * 1.5), (size * 1.5)));
            const puff = new Circle(point.x, point.y, size).setColor(this.cloudColor);
            puffs.puffs.add(puff);
        }

        return new ShapeGroup(puffs);
    },

    update() {
        if(this.firstFrame || this.frames % Canv.random(200, 300) === 0) {
            const cloud = this.getCloud(Canv.random(-100, 0), Canv.random(0, this.height));
            cloud.speed = Canv.random(1, 3);
            this.clouds.add(cloud);
        }

        this.clouds.forEach(cloud => {
            cloud.moveX(cloud.speed);
        })
    },

    draw() {
        this.background = new Color("#00dbff");
        this.add(this.clouds);
    },
});