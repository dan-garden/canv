const tictactoe = new Painter("#painter", {
    width: this.innerWidth,
    height: this.innerHeight,
    grid: [],
    turn: 1,
    setup() {
        this.cellCount = 3;
        this.tileSize = 100;
        for (let i = 0; i < this.cellCount; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cellCount; j++) {
                let tile = new Rect(
                    (this.width / 2) + (i * this.tileSize) - ((this.cellCount * this.tileSize) / 2),
                    (this.height / 2) + (j * this.tileSize) - ((this.cellCount * this.tileSize) / 2),
                    this.tileSize,
                    this.tileSize);
                // tile.piece = 0;
                tile.color = "white";
                tile.strokeWidth = 10;
                tile.showStroke = true;
                tile.player = 0;
                this.grid[i][j] = tile;
            }
        }
    },

    changeTurn() {
        this.turn = this.turn === 1 ? 2 : 1;
    },

    addPiece(player, tile) {
        if (player === 1) {
            let size = 4;
            let p1 = new Line(tile.x + (this.tileSize / size),(tile.y + this.tileSize / size),
                (tile.x + this.tileSize - (this.tileSize / size)),(tile.y + this.tileSize - (this.tileSize / size)));
            let p2 = new Line((tile.x + this.tileSize - (this.tileSize / size)),(tile.y + this.tileSize / size),
            tile.x + (this.tileSize / size),(tile.y + this.tileSize - (this.tileSize / size)));
            tile.piece = new ShapeGroup([p1, p2]);
            tile.piece.strokeWidth = 10;
        } else if (player === 2) {
            tile.piece = new Circle(tile.x + (this.tileSize / 2), tile.y + (this.tileSize / 2), this.tileSize / 2);
            tile.piece.strokeWidth = 10;
            tile.piece.noFill();
        }
        tile.player = player;
    },

    update() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let tile = this.grid[i][j];
                let tileHover = tile.contains(this.mouseX, this.mouseY);
                if (tileHover) {
                    tile.color = new Color(240);
                    if (this.mouseDown) {
                        this.addPiece(this.turn, tile);
                        this.changeTurn();
                    }
                } else {
                    tile.color = new Color(255);
                }
            }
        }
    },

    draw() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let tile = this.grid[i][j];
                this.add(tile);
                if (tile.piece) {
                    this.add(tile.piece);
                }
            }
        }
    }
});