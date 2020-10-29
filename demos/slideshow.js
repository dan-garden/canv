const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        this.ease = "outBounce";
        this.easeTiming = 2000;
        this.autoPlay = true;
        this.autoDelay = 4000;

        this.images = this.testList();
        this.curIndex = 0;

        this.gallery = this.threeImages();

        this.tasks = [];

        this.play();
    },

    testList() {
        const imgW = this.width;
        const imgH = this.height;
        const arr = [];
        const count = 500;
        for (let i = 0; i < count; i++) {
            const pic = new Pic(`https://picsum.photos/${imgW}/${imgH}`);
            pic.index = i;
            arr.push(pic);
        }
        return arr;
    },

    async doTask(i) {
        await this.tasks[i]();

        if (this.tasks[i + 1]) {
            await this.doTask(i + 1);
        } else {
            this.tasks = [];
        }
    },

    async addTask(fn) {
        this.tasks.push(fn);
        if (this.tasks.length === 1) {
            await this.doTask(0);
        }
    },

    async testFn() {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("test");
                resolve();
            }, 2000)
        })
    },

    threeImages() {
        this.images[this.getPrevIndex()].type === "prev";
        this.images[this.getPrevIndex()].x = -this.width;
        this.images[this.getPrevIndex()].opacity = 0;

        this.images[this.getNextIndex()].type === "next";
        this.images[this.getNextIndex()].x = this.width;
        this.images[this.getNextIndex()].opacity = 0;

        this.images[this.getCurIndex()].type === "cur";
        this.images[this.getCurIndex()].x = 0;
        this.images[this.getCurIndex()].opacity = 1;

        return new ShapeGroup({
            prev: this.images[this.getPrevIndex()],
            next: this.images[this.getNextIndex()],
            cur: this.images[this.getCurIndex()],
        });
    },

    getPrevIndex() {
        return this.images[this.curIndex - 1] === undefined ? this.images.length - 1 : this.curIndex -
            1;
    },

    getCurIndex() {
        return this.curIndex;
    },

    getNextIndex() {
        return this.images[this.curIndex + 1] === undefined ? 0 : this.curIndex + 1;
    },

    getRandomTransition() {
        return Canv.random(["fade", ...Object.keys(this.$easingFns)]);
    },

    async getTransition(slide) {
        const ease = this.ease === "random" ? this.getRandomTransition() : this.ease;
        if (ease === "fade") {
            slide.x = 0;
            await this.keyframe(slide, {
                opacity: 1
            }, this.easeTiming, "linear");
        } else {
            slide.opacity = 1;
            await this.keyframe(slide, {
                x: 0
            }, this.easeTiming, ease);
        }
    },

    async prevImage() {
        await this.getTransition(this.gallery.prev);
        this.curIndex = this.getPrevIndex();
        this.gallery = this.threeImages();
    },

    async nextImage() {
        await this.getTransition(this.gallery.next);
        this.curIndex = this.getNextIndex();
        this.gallery = this.threeImages();
    },

    prev() {
        this.addTask(this.prevImage.bind(this));
    },

    play() {
        if(this.autoPlay) {
            setTimeout(() => {
                this.next();
            }, this.autoDelay);
        }
    },

    next() {
        this.addTask(this.nextImage.bind(this));
        if(this.autoPlay) {
            setTimeout(() => {
                this.next();
            }, this.autoDelay);
        }
    },

    update() {

    },

    draw() {
        this.add(this.gallery);
    },
});