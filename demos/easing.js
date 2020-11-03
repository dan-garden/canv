const app = new Canv('canvas', {
    async setup() {
        this.margin = 100;
        this.speed = 3000;
        this.size = 5;

        this.keyframeIndex = -1;
        this.background = 0;
        this.current = new Text("", this.halfWidth(), 0).setAlign("center").setColor("#FFF");
        this.addedText = false;
        this.circle = new Circle(0, this.height, this.size);
        this.border = new Rect(this.margin / 2, this.margin / 2, this.width - this.margin, this.height - this.margin).setStroke(255).noFill();
        this.resetEase();
        this.nextKeyframe();

        this.canvas.addEventListener("click", () => {
            this.circle = new Circle(0, this.height, this.size);
            this.kf_keyFramesList = [];
            this.resetEase();
            this.nextKeyframe();
        })

    },

    resetEase() {
        this.circle.x = (this.margin / 2) + (this.circle.radius / 2);
        this.circle.y = this.height - (this.margin / 2) - (this.circle.radius / 2);
        this.circle.color = new Color(255);
        this.background = 0;
        this.addedText = false;
    },

    async nextKeyframe() {
        const lastEase = (Object.keys(this.$easingFns).length - 1);
        const newIndex = this.keyframeIndex === lastEase ? 0 : this.keyframeIndex + 1;
        this.keyframeIndex = newIndex;
        const easeKey = Object.keys(this.$easingFns)[this.keyframeIndex];
        this.current.string = easeKey;
        this.keyframe(this.circle.pos, { x: this.width - (this.margin / 2) }, this.speed, "linear");
        await this.keyframe(this.circle, { y: (this.margin / 2) }, this.speed, easeKey);
        this.resetEase();
        await this.nextKeyframe();
    },

    update() {
        if(!this.addedText) {
            this.addedText = true;
            // this.add(this.border);
            this.add(this.current);
        }
        this.add(this.circle);
    }
})