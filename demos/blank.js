const app = new Canv('canvas', {
    async setup() {
        this.rect = document.createElement("div");
        this.rect.style.position = "fixed";
        this.rect.style.backgroundColor = new Color(250);
        this.rect.width = 50;
        this.rect.height = 50;
        this.rect.left = 0;
        this.rect.top = 0;
        document.body.append(this.rect);
        this.keyframe(this.rect, {left: 400, top: 300}, 2000, "outBounce");
    },

    update() {

    }
})