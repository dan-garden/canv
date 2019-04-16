new Canv("canvas", {
    fullscreen: true,
    g: 4,
    colors: {
        0: new Color(238, 228, 218),
        2: new Color(238, 228, 218),
        4: new Color(237, 224, 200),
        8: new Color(242, 177, 121),
        16: new Color(245, 149, 99),
        32: new Color(246, 124, 95),
        64: new Color(246, 94, 59),
        128: new Color(237, 207, 114),
        256: new Color(237, 204, 97),
        512: new Color(237, 200, 80),
        1024: new Color(237, 197, 63),
        2048: new Color(237, 194, 46)
    },
    Tile: class Tile extends ShapeGroup {
        constructor(x, y, w, h, c, color) {
            super([]);

            this.tile = new Rect(x, y, w, h);
            this.tile.showStroke = true;
            this.tile.strokeWidth = 10;
            this.tile.stroke = new Color(206, 187, 165);
            this.tile.color = color;
            this.text = new Rect(-100, -100);
            if(c) {
                this.text = new Text(c,
                    (this.tile.x) + (this.tile.width / 2),
                    (this.tile.y) + (this.tile.height / 2),
                    40
                );
                this.text.textAlign = "center";
                this.text.fontFamily = "Courier New";
                if(c >= 8) {
                    this.text.size = 30;
                    this.text.color = new Color(255, 255, 255);
                }
            }
            this.shapes = [this.tile, this.text];
        }        
    },
    setup() {
        this.grid = [];
        for(let i = 0; i < this.g; i++) {
            this.grid[i] = [];
            for(let j = 0; j < this.g; j++) {
                this.grid[i][j] = 0;
            }
        }
    },

    shiftRight() {
        for(let i = this.g-1; i > 0; i--) {
            for(let j = this.g-1; j > 0; j--) {
                this.grid[j][i] = this.grid[j][i-1]!==undefined ? this.grid[j][i-1] : this.grid[j][i];
                this.grid[j][i-1] = 0;
            }
        }
    },

    draw() {
        for(let i = 0; i < this.g; i++) {
            for(let j = 0; j < this.g; j++) {
                const c = this.grid[i][j];

                const w = this.width / this.g;
                const h = this.height / this.g;
                const x = i * w;
                const y = j * h;
                const o = new this.Tile(x, y, w, h, c, this.colors[c] || this.colors[0]);
                
                if(this.frames % 10 === 0 && this.mouseDown && o.contains(this.mouseX, this.mouseY)) {
                    if(c==0) {
                        this.grid[i][j] = 2;
                    } else {
                        this.grid[i][j] *= 2;
                    }
                }
                
                this.add(o);
            }
        }
    }
})