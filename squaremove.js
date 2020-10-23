const app = new Canv('canvas', {
    width: window.innerWidth,
    height: window.innerHeight - 4,

    setup() {
        this.levels = [{
            name: "Level 1",
            data: [
                [2],
                [2,0,0,0,0,0,2],
                [2,0,0,9,0,0,2],
                [2,0,0,0,0,0,2],
                [2]
            ]
        }];

        this.levelIndex = 0;

        this.levelMap = false;
        this.levelLoaded = true;
        this.player = false;
        this.playerPos = false;
        this.playerSpeed = 1;
        this.playerWidth = 30;
        this.playerHeight = 30;
    },

    changeLevel(levelIndex) {
        this.levelIndex = levelIndex;
        this.levelLoaded = false;
        this.levelMap = false;
    },

    restartLevel() {
        this.changeLevel(this.levelIndex);
    },

    update() {
        const level = this.levels[this.levelIndex];
        if(!this.levelMap) {
            const cellHeight = this.height / level.data.length;

            const levelData = level.data.map((row, i) => {
                const cellWidth = this.width / row.length;
                const rowData = row.map((cellData, j) => {
                    const cellX = j * cellWidth;
                    const cellY = i * cellHeight;
                    const cell = new Rect(cellX, cellY, cellWidth, cellHeight);
                    cell.cellX = j;
                    cell.cellY = i;

                    if(cellData === 0) {
                        cell.color = new Color("#FFF");
                    } else if(cellData === 2) {
                        cell.color = new Color("grey");
                    } else if(cellData === 9) {
                        this.playerPos = new Vector(cellX + (cellWidth / 2) - (this.playerWidth / 2), cellY + (cellHeight / 2) - (this.playerHeight / 2));
                        cell.noFill();
                        cell.color = new Color("#FFF");
                    }

                    return cell;
                });
                return new ShapeGroup(rowData);
            });
            this.levelMap = new ShapeGroup(levelData);
            this.levelLoaded = true;
        }

        if(this.levelLoaded === true) {
            if(!this.player) {
                this.player = new Rect(this.halfWidth(this.playerWidth), this.halfHeight(this.playerHeight), this.playerWidth, this.playerHeight);
            }

            if(this.playerPos) {
                this.player.x = this.playerPos.x;
                this.player.y = this.playerPos.y;
                this.playerPos = false;
            }
            this.player.vel = new Vector(0, 0);
            this.player.speed = this.playerSpeed;
            this.levelLoaded = false;
        }

        if(this.player) {
            if(this.keyDown("w")) {
                this.player.vel = new Vector(0, -this.player.speed);
            } else if(this.keyDown("d")) {
                this.player.vel = new Vector(this.player.speed, 0)
            } else if(this.keyDown("s")) {
                this.player.vel = new Vector(0, this.player.speed);
            } else if(this.keyDown("a")) {
                this.player.vel = new Vector(-this.player.speed, 0)
            } else {
                this.player.vel = new Vector(0, 0);
            }

            this.player.pos.add(this.player.vel);
        }

        const current = this.playerCells(this.player);
        current.forEach(cellPos => {
            const cell = this.levelMap[cellPos.y][cellPos.x];
            cell.color.a -= 0.01;
        });
    },

    valueInRange(value, min, max) {
        return (value >= min) && (value <= max);
    },

    overlap(a, b) {
        const xOverlap = this.valueInRange(a.x,  b.x, b.x + b.width) || this.valueInRange(b.x, a.x, a.x + a.width);
        const yOverlap = this.valueInRange(a.y, b.y, b.y + b.height) || this.valueInRange(b.y, a.y, a.y + a.height);

        return xOverlap && yOverlap;
    },

    playerCells(player) {
        const cells = [];
        this.levelMap.forEach(row => {
            row.forEach(cell => {
                if(this.overlap(player, cell)) {
                    cells.push({x: cell.cellX, y: cell.cellY});
                }
            })
        })

        return cells;
    },

    draw() {
        this.clear();

        if(this.levelMap) {
            this.add(this.levelMap);
        }

        if(this.player) {
            this.add(this.player);
        }
    },
});