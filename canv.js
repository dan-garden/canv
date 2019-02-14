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
            Painter.random(0, 255),
            Painter.random(0, 255),
            Painter.random(0, 255)
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
    
}

class Point extends Shape {
    constructor(x, y) {
        super();
        this.color = new Color(0);
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
        super();
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.width = 2;
        this.color = new Color(0);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color.toString();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    }
}

class Rect extends Shape {
    constructor(x, y, w, h, color='black') {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        this.isFilled = true;
        this.isStroked = false;

        this.color = new Color(color);
        this.stroke = new Color(0);
        this.strokeWidth = 1;
    }

    noStroke() {
        this.isFilled = true;
        this.isStroked = false;
    }

    noFill() {
        this.isFilled = false;
        this.isStroked = true;
    }

    render(ctx) {
        ctx.beginPath();
        if(this.isStroked) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.stroke.toString();
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        if(this.isFilled) {
            ctx.fillStyle = this.color.toString();
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.closePath();
    }
}



class Painter {
    static random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    set width(x) {
        this.canvas.width = x;
    }
    set height(x) {
        this.canvas.height = x;
    }
    set setup(x) {
        this.$setup = x;
    }
    set update(x) {
        this.$update = x;
    }
    set draw(x) {
        this.$draw = x;
    }

    get width() {
        return this.canvas.width
    }
    get randomWidth() {
        return Painter.random(0, this.width);
    }
    get randomHeight() {
        return Painter.random(0, this.height);
    }
    get height() {
        return this.canvas.height
    }


    constructor(selector, config) {
        this.canvas = document.querySelector(selector);
        this.ctx = this.canvas.getContext('2d');

        this.$running = false;
        this.$objects = [];

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

        

    }

    start() {
        this.$running = true;
        if (this.$setup) this.$setup();
        if (this.$update || this.$draw) requestAnimationFrame(this.loop.bind(this));
    }

    loop() {
        if (this.$running) {
            if (this.$update) this.$update();
            if (this.$draw) this.$draw();
            requestAnimationFrame(this.loop.bind(this));
        }
    }





    setDimensions(w, h) {
        this.width = w;
        this.height = h;
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