const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        this.tower = new ShapeGroup();

        this.speed = 1;
        this.stackerHeight = 20;
        this.level = 0;
        this.dropDelay = 1000;
        this.increase = 0.5;

        this.current = false;
        this.dropped = true;
        this.canDrop = true;
        this.startBlock();
    },

    startBlock() {
        this.current = new Rect(0, this.height - ((this.level) * this.stackerHeight), 50, this.stackerHeight);
        this.current.dir = 1;
    },

    getLastTower() {
        return this.tower.shapes[this.tower.length - 1];
    },

    update() {
        if (this.keyDown(" ") && !this.dropped && this.canDrop) {
            this.dropped = true;
        }

        if (this.dropped && this.canDrop) {
            this.tower.add(this.current);
        }


        if (this.current) {
            if (this.current.x >= this.width - this.current.width) {
                this.current.dir = this.width - this.current.width;
                this.current.dir = -1;
            } else if (this.current.x <= 0) {
                this.current.x = 0;
                this.current.dir = 1;
            }

            this.current.x += (this.current.dir * this.speed);
        }


        if (this.dropped && this.canDrop) {

            const lastTower = this.getLastTower();
            // const offset = this.current.x - lastTower.x;
            // this.current.width = this.current.width - offset;

            this.level++;
            this.speed += this.increase;
            this.canDrop = false;
            this.dropped = false;
            this.current = false;

            setTimeout(() => {
                this.canDrop = true;
                this.startBlock();
            }, this.dropDelay);
        }

    },

    draw() {
        this.clear();
        if (this.current) {
            this.add(this.current);
        }
        this.add(this.tower);
    },

});