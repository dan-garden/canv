const app = new Canv('canvas', {
    setup() {
        this.radius = 0;
        this.angle = 0;
        this.radInc = 1;
        this.speed = 100;
        this.ease = "linear";
        this.size = 1;
        this.angleInc = 10;

        this.point = new Circle(this.halfWidth(), this.halfHeight(), this.size).setColor(255);

        this.moveToNextAngle();
        this.background = 0;
    },

    async moveToNextAngle() {
        this.point.size = this.size;
        this.angle += this.angleInc;
        const pos = new Vector(this.halfWidth() + (this.radius*Math.sin(this.angle)), this.halfHeight() + (this.radius*Math.cos(this.angle)));
        await this.animate(this.point.pos, pos, this.speed, this.ease);
        // this.point.color = new Color(255)
        this.point.color = Color.random();
        // this.animate(this.point.color, Color.random(), this.speed, this.ease);
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