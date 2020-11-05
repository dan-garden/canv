const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        // this.easing = Canv.random(Object.keys(this.$easingFns));
        this.easing = "inCirc";
        this.timing = 3000;
        this.gate = new ShapeGroup({
            topLeft: new Rect(0, 0, this.halfWidth(), this.halfHeight()),
            topRight: new Rect(this.halfWidth(), 0, this.halfWidth(), this.halfHeight()),
            botLeft: new Rect(0, this.halfHeight(), this.halfWidth(), this.halfHeight()),
            botRight: new Rect(this.halfWidth(), this.halfHeight(), this.halfWidth(), this.halfHeight()),
        }).setColor(Color.random());
    },

    async keyframes() {
        console.log(this.easing);
        this.animate(this.gate.topLeft, {x: -this.halfWidth(), y: -this.halfHeight()}, this.timing, this.easing);
        this.animate(this.gate.topRight, {x: this.width, y: -this.halfHeight()}, this.timing, this.easing);
        this.animate(this.gate.botLeft, {x: -this.halfWidth(), y: this.height}, this.timing, this.easing);
        this.animate(this.gate.botRight, {x: this.width, y: this.height}, this.timing, this.easing);
    },

    draw() {
        this.clear();
        this.add(this.gate);
    }
});