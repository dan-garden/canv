class Color {
    static fromHex(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? new Color(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ) : undefined;
    }

    static fromRef(ref) {
        const d = document.createElement("div");
        d.style.color = ref;
        d.style.display = "none";
        document.body.appendChild(d);
        const s = window.getComputedStyle(d).color
            .replace("(", "")
            .replace(")", "")
            .replace("rgb", "");
        document.body.removeChild(d);
        const c = s.split(", ").map(a => parseInt(a));
        return new Color(c[0], c[1], c[2]);
    }

    static random() {
        return new Color(
            Canv.random(0, 255),
            Canv.random(0, 255),
            Canv.random(0, 255)
        )
    }

    constructor() {
        if(arguments.length === 0) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 0;
        } else if (arguments.length === 1) {
            if(arguments[0] instanceof Color) {
                this.r = arguments[0].r;
                this.g = arguments[0].g;
                this.b = arguments[0].b;
                this.a = arguments[0].a;
            } else if (typeof arguments[0] === "number") {
                //RGB
                this.r = arguments[0];
                this.g = arguments[0];
                this.b = arguments[0];
                this.a = 1;
            } else if (arguments[0].startsWith("#")) {
                //HEX
                return Color.fromHex(arguments[0]);
            } else {
                //REF
                return Color.fromRef(arguments[0])
            }
        } else if (arguments.length === 3) {
            //RGB
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
            this.a = 1;
        } else if (arguments.length === 4) {
            //RGBA
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
            this.a = arguments[3];
        }
    }

    toString(type="rgba") {
        return type=="rgba"
            ?`rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
            :`rgb(${this.r}, ${this.g}, ${this.b})`
    }

    randomize() {
        const c = Color.random();
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.showFill = true;
        this.showStroke = false;

        this.angle = 0;

        this.color = new Color(color);
        this.stroke = new Color(0);
        this.strokeWidth = 1;
    }
    
    noStroke() {
        this.showFill = true;
        this.showStroke = false;
    }

    noFill() {
        this.showFill = false;
        this.showStroke = true;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    setDimensions(w, h) {
        this.width = w;
        this.height = h;
    }

    setColor(n) {
        this.color = new Color(n);
        return this;
    }

    renderRotation(ctx) {
        let w=this.width,
            h=this.height,
            x=this.x,
            y=this.y;

        if(this.angle) {
            ctx.translate(x+w/2,y+h/2);
            ctx.rotate(this.angle*(Math.PI/180));
            ctx.translate(-(x+w/2),-(y+h/2));
        }
    }
    
}

class ShapeGroup {
    constructor(shapes) {
        Object.keys(shapes).forEach(shapeKey => {
            this[shapeKey] = shapes[shapeKey];
        })
        this.shapes = shapes;
    }
    
    set color(x) {
        Object.values(this.shapes).forEach(shape => shape.color = x);
    }

    set strokeWidth(x) {
        Object.values(this.shapes).forEach(shape => shape.strokeWidth = x);
    }

    set stroke(x) {
        Object.values(this.shapes).forEach(shape => shape.stroke = x);
    }

    noStroke() {
        Object.values(this.shapes).forEach(shape => shape.noStroke());
    }

    noFill() {
        Object.values(this.shapes).forEach(shape => shape.noFill());
    }

    render(ctx) {
        Object.values(this.shapes).forEach(shape => shape.render(ctx));
    }

    contains(x, y) {
        return Object.values(this.shapes).map(shape => {
            return shape.contains ? shape.contains(x, y) : false
        }).some(contains => contains == true);
    }

    moveX(n) {
        Object.values(this.shapes).forEach(s => (s.x+=n) && (s.x2 ? s.x2 += n : null))
    }

    moveY(n) {
        Object.values(this.shapes).forEach(s => (s.y+=n) && (s.y2 ? s.y2 += n : null))
    }

    rotate(n) {
        Object.values(this.shapes).forEach(shape => shape.angle+=n);
    }
}

class Pic extends Shape {
    constructor(src, x=0, y=0, width, height) {
        super(x, y, 0);
        this.image = new Image();
        this.src = src;

        this.width = width;
        this.height = height;


        this.image.onload = () => {
            this.loaded = true;
            if(!this.width) {
                this.width = this.image.naturalWidth;
            }
            if(!this.height) {
                this.height = this.image.naturalHeight;
            }
        };
    }

    contains(x, y) {
        return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
    }

    set src(n) {
        this.image.src = n;
    }

    render(ctx) {
        if(!this.loaded) {
            setTimeout(() => this.render(ctx), 0);
        } else {
            ctx.save();
            ctx.beginPath();
            this.renderRotation(ctx);
            if(this.showStroke) {
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.stroke.toString();
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
            if(this.showFill) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            ctx.closePath();
            ctx.restore();
        }
    }
}

class Point extends Shape {
    constructor(x, y) {
        super(x, y);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color.toString();
        ctx.strokeRect(this.x, this.y, 1, 1);
        ctx.closePath();
    }
}

class Line extends Shape {
    constructor(x1, y1, x2, y2) {
        super(x1, y1, new Color(0));
        this.x2 = x2;
        this.y2 = y2;
    }

    get x1() {
        return this.x;
    }

    get y1() {
        return this.y;
    }

    set width(n) {
        this.strokeWidth = n;
    }

    get width() {
        return this.strokeWidth;
    }

    set size(n) {
        this.strokeWidth = n;
    }

    get size() {
        return this.strokeWidth;
    }

    get length() {
        return new Vector(
            this.x2 - this.x1,
            this.y2 - this.y1
        );
    }

    contains(x, y) {
        return false;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.color.toString();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    }
}

class Rect extends Shape {
    constructor(x=0, y=0, w=5, h=5, color='black') {
        super(x, y, color);
        this.width = w;
        this.height = h;
    }

    render(ctx) {
        ctx.save();
        ctx.beginPath();
        this.renderRotation(ctx);
        if(this.showStroke) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.stroke.toString();
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        if(this.showFill) {
            ctx.fillStyle = this.color.toString();
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.closePath();
        ctx.restore();
    }

    contains(x, y) {
        return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
    }
}

class Circle extends Shape {
    constructor(x=0, y=0, radius=5, color='black') {
        super(x, y, color);
        this.size = radius;
    }

    set radius(n) {
        this.size = n;
    }

    get radius() {
        return this.size;
    }

    contains(x, y) {
        return ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.radius * this.radius);
    }

    render(ctx) {
        ctx.beginPath();
        if(this.showStroke) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.stroke.toString();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.stroke();
        }

        if(this.showFill) {
            ctx.fillStyle = this.color.toString();
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.closePath();
    }
}

class Text extends Shape {
    constructor(string="undefined", x=0, y=0, fontSize=20) {
        super(x, y, 0);

        this.string = string;

        this.textAlign = "left";
        this.fontSize = fontSize;
        this.fontFamily = "Comic Sans MS";
    }

    get font() {
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.textAlign = this.textAlign;
        ctx.font = this.font;


        if(this.showStroke) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.stroke.toString();
            ctx.strokeText(this.string, this.x, this.y);
        }

        if(this.showFill) {
            ctx.fillStyle = this.color.toString();
            ctx.fillText(this.string, this.x, this.y);
        }
        ctx.closePath();
    }
}


class Canv {
    static random(min, max) {
        if(arguments.length === 1) {
            max = Math.floor(min);
            min = 0;
        } else if(arguments.length === 2) {
            min = Math.ceil(min);
            max = Math.floor(max);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    set width(x) {
        this.canvas.width = x;
    }
    set height(x) {
        this.canvas.height = x;
    }
    set setup(x) {
        this.$setup = () => {
            x();
        };
    }
    set update(x) {
        this.$update = (n) => {
            x(n);
        };
    }
    set draw(x) {
        this.$draw = (n) => {
            x(n);
        };
    }

    set background(n) {
        this.$background = new Color(n);
        if(this.$background) {
            let bg = new Rect(0, 0, this.width, this.height);
            bg.color = this.background;
            this.add(bg);
        }
    }

    get background() {
        return this.$background;
    }

    get width() {
        return this.canvas.width
    }
    get randomWidth() {
        return Canv.random(0, this.width);
    }
    get randomHeight() {
        return Canv.random(0, this.height);
    }
    get height() {
        return this.canvas.height
    }


    constructor(selector, config) {
        let noSelector = true;
        if(typeof selector === "object") {
            config = selector;
            this.canvas = document.createElement("canvas");
        } else {
            noSelector = false;
            this.canvas = document.querySelector(selector);
        }
        this.ctx = this.canvas.getContext('2d');

        this.frames = 0;
        this.$running = false;

        this.$updateDelay = 0;
        this.$drawDelay = 0;

        this.keysDown = {};

        this.width = 100;
        this.height = 100;
        this.background = new Color(255);

        if (config && typeof config === "object") {
            const configKeys = Object.keys(config);
            configKeys.forEach(key => {
                if(key === "setup" || key === "update" || key === "draw") {
                    this["$"+key] = config[key].bind(this);
                } else {
                    this[key] = config[key];
                }
            })
        }

        this.binds();
        this.start();

        if(noSelector) {
            return this.canvas;
        }
    }

    binds() {
        this.canvas.addEventListener("mousedown", e => {
            this.mouseDown = true;
            this.mouseX = this.mouseOver ? e.layerX : false;
            this.mouseY = this.mouseOver ? e.layerY : false;
        })

        this.canvas.addEventListener("mouseup", e => {
            this.mouseDown = false;
        })

        this.canvas.addEventListener("mousemove", e => {
            this.mousePrevX = this.mouseX;
            this.mousePrevY = this.mouseY;
            this.mouseX = this.mouseOver ? e.layerX : false;
            this.mouseY = this.mouseOver ? e.layerY : false;
        });

        this.canvas.addEventListener("mouseover", e => {
            this.mouseOver = true;
        })

        this.canvas.addEventListener("mouseout", e => {
            this.mouseOver = true;
            this.mouseDown = false;
        });

        window.addEventListener("keyup", e => {
            if(this.keysDown[e.key]) {
                delete this.keysDown[e.key];
            }
        });

        window.addEventListener("keydown", e => {
            if(!this.keysDown[e.key]) {
                this.keysDown[e.key] = true;
            }
        })

    }

    start() {
        if(!this.$running) {
            this.$running = true;
            if (this.$setup) this.$setup();
            if (this.$update || this.$draw) requestAnimationFrame(this.loop.bind(this));
        }
        return this;
    }

    keyDown(key) {
        return this.keysDown[key];
    }

    stop() {
        if(this.$running) {
            this.$running = false;
        }
        return this;
    }

    loop() {
        if (this.$running) {
            this.frames++;
            if(this.$update && (this.$updateDelay===0 || this.frames%this.$updateDelay===0)) {
                if (this.$update) this.$update(this.frames);
            }
            if(this.$draw && (this.$drawDelay===0 || this.frames%this.$drawDelay===0)) {
                if (this.$draw) this.$draw(this.frames);
            }
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    set updateDelay(delay) {
        if(typeof delay === "number" && delay > 0) {
            this.$updateDelay = delay;
        } else {
            this.$updateDelay = 0;
        }
    }

    set drawDelay(delay) {
        if(typeof delay === "number" && delay > 0) {
            this.$drawDelay = delay;
        } else {
            this.$drawDelay = 0;
        }
    }


    get pixels() {
        const px = [];
        const data = this.ctx.getImageData(0, 0, this.width, this.height).data;
        const l = this.width * this.height;
        for (let i = 0; i < l; i++) {
            let r = data[i*4]; // Red
            let g = data[i*4+1]; // Green
            let b = data[i*4+2]; // Blue
            let a = data[i*4+3]; // Alpha
            let y = parseInt(i / this.width, 10);
            if(!px[y]) {
                px[y] = [];
            }
            let x = i - y * this.width;
            let color = new Color(r, g, b, a);
            px[y][x] = color;
        }
        return px;
    }

    setDimensions(w, h) {
        this.width = w;
        this.height = h;
    }

    halfWidth(n) {
        return n ? (this.width / 2) - (n / 2) : this.width / 2
    }

    halfHeight(n) {
        return n ? (this.height / 2) - (n / 2) : this.height / 2
    }

    clear(x = 0, y = 0, w = this.width, h = this.height) {
        this.ctx.clearRect(x, y, w, h);
    }

    add(n) {
        if (n) {
            n.render(this.ctx);
        }
    }
}