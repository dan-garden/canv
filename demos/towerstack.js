const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        this.resetTower();

        this.stackerHeight = 20;
        this.stackerWidth = 100;
        this.dropDelay = 1000;
        this.increase = 1;

        this.current = false;
        this.dropped = true;
        this.canDrop = true;
        this.startBlock();
    },

    startBlock() {
        this.current = new Rect(0, this.height - ((this.level) * this.stackerHeight), this.stackerWidth,
            this.stackerHeight);
        this.current.dir = 1;
    },

    resetTower() {
        this.tower = new ShapeGroup();
        this.levelText = new Text(0, 0, 0);
        this.levelText.fontSize = 50;
        this.speed = 1;
        this.current = false;
        this.level = 0;
    },

    getLastTower() {
        return this.tower.shapes[0];
    },

    update() {
        if (this.keyDown(" ") && !this.dropped && this.canDrop) {
            this.dropped = true;
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
            if (lastTower) {
                const cur_left = this.current.x;
                const cur_right = this.current.x + this.current.width;

                const last_left = lastTower.x;
                const last_right = lastTower.x + lastTower.width;

                if (this.level > 1 && (cur_left > last_right || cur_right < last_left)) {
                    this.resetTower();
                    return;
                } else {

                }
            }


            if (this.current) {
                this.tower.add(this.current);
            }
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

        this.levelText.string = this.level;
        this.levelText.textAlign = "center";
        this.levelText.x = this.current.x + (this.stackerWidth / 2);
        this.levelText.y = this.current.y - 50 - this.stackerHeight;

    },

    draw() {
        this.clear();
        this.add(this.levelText);
        if (this.current) {
            this.add(this.current);
        }
        this.add(this.tower);
    },

});