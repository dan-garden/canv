const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,
    setup() {
        document.body.style.background = new Color(0);
        this.cannon = new ShapeGroup({
            gun: new Line(this.width / 2, this.height - 10, this.width / 2, this.height - 50).setWidth(5).setColor(255)
        })

        this.dist = new Vector(0, 0);
        this.gunAngle = -1;

        // const endX = startX - Math.sin(angle) * dist;
        // const endY = startY - Math.cos(angle) * dist;
    },

    update() {
        


        this.cannon.gun.x2 = this.cannon.gun.x2 - Math.cos(this.gunAngle) * this.dist.x;
        this.cannon.gun.y2 = this.cannon.gun.y2 - Math.sin(this.gunAngle) * this.dist.y;
    },

    draw() {
        this.background = 0;
        this.add(this.cannon);
    }
})