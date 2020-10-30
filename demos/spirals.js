const app = new Canv('canvas', {
    setup() {
        this.radius = 0;
        this.angle = 0;
        this.radInc = 0.05;
        this.speed = 300;
        this.ease = "linear";
        this.size = 1;
        this.angleInc = 0.8;

        this.point = new Circle(this.halfWidth(), this.halfHeight(), this.size).setColor(255);

        this.moveToNextAngle();
        this.background = 0;
    },

    randomFloat(min, max) {
        return (Math.random() * (max - min) + min).toFixed(4);
    },

    async moveToNextAngle() {
        this.point.size = this.size;
        this.angle += this.angleInc;
        const pos = new Vector(this.halfWidth() + (this.radius*Math.sin(this.angle)), this.halfHeight() + (this.radius*Math.cos(this.angle)));
        await this.keyframe(this.point.pos, pos, this.speed, this.ease);
        this.point.color = Color.random();
        // this.keyframe(this.point.color, Color.random(), this.speed, this.ease);
        await this.moveToNextAngle();
    },

    async keyframes() {

    },

    update() {
        this.radius += this.radInc;
    },

    draw() {
        // this.clear();
        this.add(this.point);
    }
})