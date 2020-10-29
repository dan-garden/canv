const app = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.circle = new Circle(this.halfWidth(), this.halfHeight(), 40);
        this.canvas.addEventListener("mousedown", async () => {
            this.keyframe(this.circle.pos, { x: this.mouse.x, y: this.mouse.y }, 500, "outElastic");
            this.keyframe(this.circle, { size: 10 }, 500, "outElastic");
            this.keyframe(this.circle, { size: 40 }, 200, "linear");
        })
    },

    draw() {
        this.clear();
        this.add(this.circle);
    }
})