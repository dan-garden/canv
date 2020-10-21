class ActionRecorder {
    constructor() {
        this.actions = [];
        this.startTime = false;
        this.recording = false;
        this.lastTime = false;
    }

    export () {
        return JSON.stringify(this.actions);
    }

    import(data) {
        if (typeof data === "string") {
            this.actions = JSON.parse(data);
        } else if (typeof data === "object") {
            this.actions = data;
        }
        return this;
    }

    startRecording() {
        this.startTime = Date.now();
        this.lastTime = Date.now();
        this.recording = true;

        return this;
    }

    replayRecording(fn, cb) {
        const playMark = (playingIndex) => {
            const action = this.actions[playingIndex];
            const nextAction = this.actions[playingIndex + 1];
            if (typeof fn === "function") {
                fn(action.d, action.t);
            }
            if (nextAction) {
                setTimeout(() => {
                    playMark(playingIndex + 1);
                }, nextAction.t);
            } else {
                if (typeof cb === "function") {
                    cb();
                }
            }
        }
        playMark(0);
    }

    stopRecording() {
        this.recording = false;
        return this;
    }

    resetRecording() {
        this.actions = [];
        this.startTime = false;
        this.recording = false;
        this.lastTime = false;
        return this;
    }

    clear() {
        this.actions = [];
        this.lastTime = Date.now();
        return this;
    }

    mark(d) {
        if (!this.recording) {
            this.startRecording();
        }
        this.actions.push({
            t: Date.now() - this.lastTime,
            d
        });
        this.lastTime = Date.now();
        return this;
    }
}

class Color {
    static fromHex(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
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
        if (arguments.length === 0) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 0;
        } else if (arguments.length === 1) {
            if (arguments[0] instanceof Color || typeof arguments[0] === "object") {
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



        this.normalize();
    }

    toString(type = "rgba") {
        return type == "rgba" ?
            `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` :
            `rgb(${this.r}, ${this.g}, ${this.b})`
    }

    normalize() {
        if (this.r > 255) {
            this.r = 255;
        }
        if (this.g > 255) {
            this.g = 255;
        }
        if (this.b > 255) {
            this.b = 255;
        }

        if (this.r < 0) {
            this.r = 0;
        }
        if (this.g < 0) {
            this.g = 0;
        }
        if (this.b < 0) {
            this.b = 0;
        }
        return this;
    }

    shade(n) {
        this.r = this.r + n;
        this.g = this.g + n;
        this.b = this.b + n;
        return this.normalize();
    }

    setAlpha(n) {
        this.a = n;
        return this;
    }

    invert() {
        this.r = 255 - this.r;
        this.g = 255 - this.g;
        this.b = 255 - this.b;
        return this;
    }

    greyscale() {
        const s = (this.r + this.g + this.b) / 3;
        this.r = s;
        this.g = s;
        this.b = s;
        return this;
    }

    sepia() {
        this.r = (0.393 * this.r) + (0.769 * this.g) + (0.189 * this.b);
        this.g = (0.349 * this.r) + (0.686 * this.g) + (0.168 * this.b);
        this.b = (0.272 * this.r) + (0.534 * this.g) + (0.131 * this.b);
        return this;
    }

    opacity(a) {
        this.a = a;
        return new Color(this);
    }

    randomize() {
        const c = Color.random();
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
    }

    saturate(value) {
        var gray = 0.2989 * this.r + 0.5870 * this.g + 0.1140 * this.b;
        this.r = -gray * value + this.r * (1 + value);
        this.g = -gray * value + this.g * (1 + value);
        this.b = -gray * value + this.b * (1 + value);
        return this.normalize();
    }

    get hsp() {
        const hsp = Math.sqrt(
            0.299 * (this.r * this.r) +
            0.587 * (this.g * this.g) +
            0.114 * (this.b * this.b)
        );
        return hsp;
    }


    lightOrDark() {
        if (this.hsp > 127.5) {
            return 'light';
        } else {
            return 'dark';
        }
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static getLine(a, b, count) {
        count = count + 1;
        const d = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) / count;
        const fi = Math.atan2(b.y - a.y, b.x - a.x);

        const points = [];
        for (let i = 0; i <= count; ++i) {
            points.push(new Vector(a.x + i * d * Math.cos(fi), a.y + i * d * Math.sin(fi)));
        }
        return points;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    add(v) {
        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y;
        } else if (!Number.isNaN(v)) {
            this.x += v;
            this.y += v;
        }
    }

    subtract(v) {
        if (v instanceof Vector) {
            this.x -= v.x;
            this.y -= v.y;
        } else if (!Number.isNaN(v)) {
            this.x -= v;
            this.y -= v;
        }
    }

    multi(v) {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
        } else if (!Number.isNaN(v)) {
            this.x *= v;
            this.y *= v;
        }
    }

    moveX(n) {
        this.x += n;
    }

    moveY(n) {
        this.y += n;
    }
}

class ShapeEventListener {
    constructor() {
        this.events = {

        };
    }

    register(type, fn) {
        if (typeof type === "string" && typeof fn === "function") {
            if (!this.exists(type)) {
                this.events[type] = [];
            }

            this.events[type].push(fn);
        }
    }

    trigger(type, params) {
        if (this.exists(type)) {
            this.events[type].forEach(event => {
                if (params) {
                    event(...params)
                } else {
                    event();
                }
            });
        }
    }

    exists(type) {
        return (type && this.events[type])
    }
}

class Shape {
    constructor(x, y) {
        this.$events = new ShapeEventListener();
        this.$mouseover = false;
        this.$mousedown = false;
        this.pos = new Vector(x, y);

        this.showFill = true;
        this.showStroke = false;

        this.angle = 0;

        this.color = new Color(0);
        this.stroke = new Color(0);
        this.dash = [];
        this.strokeWidth = 1;

        this.shown = true;
    }

    set x(n) {
        this.pos.x = n;
    }

    set y(n) {
        this.pos.y = n;
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    noStroke() {
        this.showFill = true;
        this.showStroke = false;
        return this;
    }

    hide() {
        this.shown = false;
        return this;
    }

    show() {
        this.shown = true;
        return this;
    }

    noFill() {
        this.showFill = false;
        this.showStroke = true;
        return this;
    }

    setPos(x, y) {
        this.pos.setPos(x, y);
        return this;
    }

    setDimensions(w, h) {
        this.width = w;
        this.height = h;
        return this;
    }

    setColor(n) {
        this.color = new Color(n);
        return this;
    }

    setStroke(n, s) {
        this.stroke = new Color(n);
        if (s) {
            this.setStrokeWidth(s);
        }
        this.showStroke = true;
        return this;
    }

    setStrokeWidth(n) {
        this.strokeWidth = n;
        return this;
    }

    applyConfig(config) {
        if (typeof config === "object") {
            Object.keys(config).forEach(configKey => {
                this[configKey] = config[configKey];
            })
        }
    }

    moveX(n) {
        this.x += n;
        return this;
    }

    moveY(n) {
        this.y += n;
        return this;
    }

    rotate(n) {
        this.angle += n;
        return this;
    }

    setAngle(n) {
        this.angle = n;
        return this;
    }

    contains() {
        return false;
    }

    addEventListener(type, fn) {
        this.$events.register(type, fn);
    }

    trigger(event, params) {
        this.$events.trigger(event, params);
    }

    preRender(canv) {
        if (!this.shown) {
            return false;
        }

        if (canv.mouseDown && this.contains(canv.mouseX, canv.mouseY)) {
            this.$mousedown = true;
            this.trigger("mousedown", [canv]);
        }

        if (this.contains(canv.mouseX, canv.mouseY) && this.$mousedown === true && !canv.mouseDown) {
            this.$mousedown = false;
            this.trigger("mouseup", [canv]);
            this.trigger("click", [canv]);
        }

        if (!this.contains(canv.mouseX, canv.mouseY)) {
            this.$mousedown = false;
        }

        if (this.contains(canv.mouseX, canv.mouseY)) {
            this.$mouseover = true;
            this.trigger("mouseover", [canv]);
        }

        if (this.$mouseover === true && !this.contains(canv.mouseX, canv.mouseY)) {
            this.$mouseover = false;
            this.trigger("mouseout", [canv]);
        }

        return true;
    }

    renderRotation(canv) {
        let w = this.width,
            h = this.height,
            x = this.x,
            y = this.y;

        if (this.angle) {
            canv.ctx.translate(x + w / 2, y + h / 2);
            canv.ctx.rotate(this.angle * (Math.PI / 180));
            canv.ctx.translate(-(x + w / 2), -(y + h / 2));
        }
    }

}

class ShapeGroup {
    constructor(shapes = []) {
        Object.keys(shapes).forEach(shapeKey => {
            this[shapeKey] = shapes[shapeKey];
        })
        this.shapes = Object.values(shapes);
    }

    setColor(x) {
        this.forEach(shape => shape.color = x);
        return this;
    }

    set strokeWidth(x) {
        this.forEach(shape => shape.strokeWidth = x);
    }

    set stroke(x) {
        this.forEach(shape => shape.stroke = x);
    }

    remove(i) {
        if (this[i]) {
            delete this[i];
        }

        this.shapes.splice(i, 1);
        return this;
    }

    forEach(fn) {
        if (typeof fn === "function") {
            for (let i = this.length - 1; i >= 0; --i) {
                fn(this.shapes[i], i);
            }
        }
        return this;
    }

    map(fn) {
        if (typeof fn === "function") {
            for (let i = this.length - 1; i >= 0; --i) {
                this.shapes[i] = fn(this.shapes[i], i);
            }
        }
        return this;
    }

    filter(fn) {
        if (typeof fn === "function") {
            for (let i = this.length - 1; i >= 0; --i) {
                let f = fn(this.shapes[i], i);
                if (!f) {
                    this.remove(i);
                }
            }
        }
        return this;
    }

    noStroke() {
        this.forEach(shape => shape.noStroke());
    }

    noFill() {
        this.forEach(shape => shape.noFill());
    }

    render(canv) {
        this.forEach(shape => shape.render(canv));
    }

    contains(x, y) {
        return Object.values(this.shapes).map(shape => {
            return shape.contains ? shape.contains(x, y) : false
        }).some(contains => contains == true);
    }

    add(n, i) {
        if (typeof n === "string" && typeof i === "object") {
            this[n] = i;
            this.shapes.unshift(i);
        } else {
            this.shapes.unshift(n);
        }
        return this;
    }

    clear() {
        this.shapes = [];
        return this;
    }

    moveX(n) {
        this.forEach(s => {
            s.moveX(n)
        })
    }

    moveY(n) {
        this.forEach(s => {
            s.moveY(n)
        })
    }

    shrink(n = 1) {
        this.forEach(s => s.size -= n)
    }

    grow(n = 1) {
        this.forEach(s => s.size += n)
    }

    rotate(n = 1) {
        this.forEach(shape => shape.angle += n);
        return this;
    }

    get length() {
        return this.shapes.length;
    }
}

class Pic extends Shape {
    constructor(src, x = 0, y = 0, width, height, fn) {
        super(x, y);
        this.image = new Image();
        this.src = src;
        this.opacity = 1;

        this.$pixels = false;

        this.width = width;
        this.height = height;


        this.image.onload = () => {
            this.loaded = true;
            if (!this.width) {
                this.width = this.image.naturalWidth;
            }
            if (!this.height) {
                this.height = this.image.naturalHeight;
            }
            if (typeof fn === "function") {
                fn(this);
            }
        };
    }

    contains(x, y) {
        return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
    }

    set src(n) {
        this.image.src = n;
    }

    get src() {
        return this.image.src;
    }


    getPixels(x = 0, y = 0, w = this.width, h = this.height) {
        const px = [];
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.image, 0, 0, w, h);
        const data = ctx.getImageData(x, y, w, h).data;
        const l = w * h;
        for (let i = 0; i < l; i++) {
            let r = data[i * 4]; // Red
            let g = data[i * 4 + 1]; // Green
            let b = data[i * 4 + 2]; // Blue
            let a = data[i * 4 + 3]; // Alpha
            let yc = parseInt(i / w, 10);
            if (!px[yc]) {
                px[yc] = [];
            }
            let xc = i - yc * w;
            let color = new Color(r, g, b, a);
            px[yc][xc] = color;
        }

        this.$pixels = px;
        return px;
    }

    render(canv) {
        if (!this.loaded) {
            setTimeout(() => this.render(canv), 0);
        } else {
            if (this.preRender(canv)) {
                canv.ctx.save();
                canv.ctx.beginPath();
                this.renderRotation(canv);
                canv.ctx.globalAlpha = this.opacity;
                if (this.showStroke) {
                    canv.ctx.lineWidth = this.strokeWidth;
                    canv.ctx.strokeStyle = this.stroke.toString();
                    canv.ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
                if (this.showFill) {
                    canv.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                }
                canv.ctx.globalAlpha = 1;
                canv.ctx.closePath();
                canv.ctx.restore();
            }
        }
    }
}

class Sprite extends ShapeGroup {
    constructor() {
        super(...arguments)
    }
    getString(width = 100, height = 100) {
        const canv = document.createElement("canvas");
        const id = "sprite-" + Canv.random(10000, 99999);
        canv.id = id;
        document.body.append(canv);
        const c = new Canv("#" + id, {
            width,
            height,
            fullscreen: false,
            createSprite(spr) {
                this.add(spr);
                return this.snapshot();
            }
        });
        let sprite = c.createSprite(this);
        document.body.removeChild(canv);
        return sprite;
    }
}

class Point extends Shape {
    constructor(x, y) {
        super(x, y);
    }

    render(canv) {
        if (this.preRender(canv)) {
            canv.ctx.beginPath();
            canv.ctx.strokeStyle = this.color.toString();
            canv.ctx.strokeRect(this.x, this.y, 1, 1);
            canv.ctx.closePath();
        }
    }
}

class Line extends Shape {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        super();

        if (x1 instanceof Vector && y1 instanceof Vector) {
            this.pos = x1;
            this.pos2 = y1;
        } else {
            this.pos = new Vector(x1, y1);
            this.pos2 = new Vector(x2, y2);
        }

        this.lineCap = "round";
    }

    moveX(n) {
        this.pos.moveX(n);
        this.pos2.moveX(n);
    }

    moveY(n) {
        this.pos.moveY(n);
        this.pos2.moveY(n);
    }

    get x1() {
        return this.pos.x;
    }

    set x1(n) {
        this.pos.x = n;
    }

    get y1() {
        return this.pos.y;
    }

    set y1(n) {
        this.pos.y = n;
    }

    get x2() {
        return this.pos2.x;
    }

    set x2(n) {
        this.pos2.x = n;
    }

    get y2() {
        return this.pos2.y;
    }

    set y2(n) {
        this.pos2.y = n;
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

    render(canv) {
        if (this.preRender(canv)) {
            canv.ctx.beginPath();
            canv.ctx.lineWidth = this.strokeWidth;
            canv.ctx.lineCap = this.lineCap;
            canv.ctx.strokeStyle = this.color.toString();
            canv.ctx.moveTo(this.pos.x, this.pos.y);
            canv.ctx.lineTo(this.pos2.x, this.pos2.y);
            canv.ctx.stroke();
            canv.ctx.closePath();
        }
    }
}

class Rect extends Shape {
    constructor(x = 0, y = 0, w = 5, h = 5) {
        super(x, y);
        this.width = w;
        this.height = h;

        this.str = false;
    }

    set text(n) {
        if (!n) {
            this.str = false;
        } else {
            if (this.str) {
                this.str.string = n;
            } else {
                this.str = new Text(n);
                this.str.textAlign = "center";
            }
        }
    }

    get text() {
        return this.str ? this.str.string : false;
    }

    renderText(canv) {
        this.str.setPos(this.x + (this.width / 2), this.y + (this.height / 2));
        this.str.render(canv);
    }

    render(canv) {
        if (this.preRender(canv)) {
            canv.ctx.save();
            canv.ctx.beginPath();
            this.renderRotation(canv);
            if (this.showStroke) {
                canv.ctx.lineWidth = this.strokeWidth;
                canv.ctx.strokeStyle = this.stroke.toString();
                canv.ctx.strokeRect(this.x, this.y, this.width, this.height);
            }

            if (this.showFill) {
                canv.ctx.fillStyle = this.color.toString();
                canv.ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            canv.ctx.closePath();
            canv.ctx.restore();
            if (this.str) {
                this.renderText(canv);
            }
        }
    }

    contains(x, y) {
        return (x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height);
    }
}

class Circle extends Shape {
    constructor(x = 0, y = 0, radius = 5) {
        super(x, y);
        this.size = radius;
    }

    set radius(n) {
        this.size = n;
    }

    setRadius(n) {
        this.size = n;
        return this;
    }

    get radius() {
        return this.size;
    }

    shrink(n) {
        this.size -= n;
    }

    grow(n) {
        this.size += n;
    }

    contains(x, y) {
        return ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.radius * this.radius);
    }

    render(canv) {
        if (this.preRender(canv)) {
            if (this.size >= 0) {
                canv.ctx.beginPath();
                if (this.showStroke) {
                    canv.ctx.lineWidth = this.strokeWidth;
                    canv.ctx.strokeStyle = this.stroke.toString();
                    canv.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    canv.ctx.stroke();
                }

                if (this.showFill) {
                    canv.ctx.fillStyle = this.color.toString();
                    canv.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    canv.ctx.fill();
                }
                canv.ctx.closePath();
            }
        }
    }
}

class Triangle extends Shape {
    constructor(x1, y1, x2, y2, x3, y3) {
        super(x1, y1);
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }

    get x1() {
        return this.x;
    }

    get y1() {
        return this.y;
    }

    contains(x, y) {
        return false;
    }

    render(canv) {
        if (this.preRender(canv)) {
            canv.ctx.save();
            canv.ctx.beginPath();
            canv.ctx.moveTo(this.x1, this.y1);
            canv.ctx.lineTo(this.x2, this.y2);
            canv.ctx.lineTo(this.x3, this.y3);
            if (this.showStroke) {
                canv.ctx.lineWidth = this.strokeWidth;
                if (this.dash.length > 0) {
                    canv.ctx.setLineDash(this.dash);
                }
                canv.ctx.strokeStyle = this.stroke.toString();
                canv.ctx.lineTo(this.x1, this.y1);
                canv.ctx.stroke();
            }

            if (this.showFill) {
                canv.ctx.fillStyle = this.color.toString();
                canv.ctx.fill();
            }
            canv.ctx.closePath();
            canv.ctx.restore();
        }
    }
}

class BarGraph extends ShapeGroup {
    constructor(config) {
        super({
            bounds: config.bounds || new Rect(0, 0, 100, 100),
            steps: new ShapeGroup,
            bars: new ShapeGroup,
        });
        this.label = config.label || "No Label";
        this.step = config.step || 1;
        this.gap = config.gap === undefined ? 20 : config.gap;
        this.shadow = config.shadow === undefined ? 2 : config.shadow;
        this.lines = config.lines === undefined ? true : config.lines;
        this.fields = config.fields || [];
        this.max = config.max === undefined ? "calc" : config.max;


        this.update();
    }

    update() {
        this.highest = this.max === "calc" ? Math.max(...this.fields.map(f => f.number)) : this.max;

        this.steps.shapes = [];
        this.bars.shapes = [];
        this.bounds.showStroke = false;
        this.bounds.showFill = false;
        const len = this.fields.length;
        const step = this.bounds.height / (this.highest / (this.step));
        let j = 0;
        for (let i = 0; i <= this.highest; i += this.step) {
            let stepShape = new ShapeGroup;
            let stepLabel = new Text(
                i,
                this.bounds.x - 30,
                this.bounds.y + this.bounds.height - ((j * step))
            ).setSize(12).setFont("Verdana");
            stepShape.add(stepLabel);

            let stepMarker = new Rect(
                stepLabel.x + 20,
                stepLabel.y,
                10,
                1
            );
            stepShape.add(stepMarker);

            if (this.lines) {
                let stepLine = new Rect(
                    stepMarker.x,
                    stepMarker.y,
                    this.bounds.width + 20,
                    1
                ).setColor(200);
                stepShape.add(stepLine);
            }


            this.steps.add(stepShape);
            j++;
        }

        this.fields.map((field, i) => {
            let g = this.gap;
            let w = (this.bounds.width / len) - g;
            let h = field.number * (this.bounds.height / this.highest);
            let x = (g / 2) + this.bounds.x + (i * (w + g));
            let y = (this.bounds.height + this.bounds.y) - h;
            let c = field.color;
            const s = this.shadow;
            const bar = new ShapeGroup({
                shadow: new Rect(x + s, y - s, w, h + s).setColor(new Color(c).shade(-100)),
                bar: new Rect(x, y, w, h).setColor(c),
                text: field.label ? new Text(field.label, x, y - 2 - s).setSize(12).setFont("Verdana") : new Rect(-100, -100, 0, 0),
            });
            this.bars.add(bar);
        });
    }
}

class Grid extends ShapeGroup {
    constructor(x, y, width, height, rows, cols) {
        super([]);
        this.cells = [];

        this.rows = rows;
        this.cols = cols;
        const cw = width / this.cols;
        const ch = height / this.rows;
        const white = new Color(255);
        const black = new Color(0);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const cx = x + (i * cw);
                const cy = y + (j * ch);
                const cell = new Rect(cx, cy, cw, ch);
                cell.posx = i;
                cell.posy = j;
                cell.color = white;
                cell.setStroke(1, black);
                this.cells.push(cell);
            }
        }
        this.shapes = this.cells;
    }

    cell(x, y) {
        return this.cells[this.cols * x + y];
    }
}

class ImageGrid extends ShapeGroup {
    constructor(x, y, width, height, rows, cols) {
        super([]);
        this.cells = [];

        this.rows = rows;
        this.cols = cols;
        const cw = width / this.cols;
        const ch = height / this.rows;
        const white = new Color(255);
        const black = new Color(0);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const cx = x + (i * cw);
                const cy = y + (j * ch);
                const cell = new Pic(null, cx, cy, cw, ch);
                cell.posx = i;
                cell.posy = j;
                cell.setStroke(1, black);
                this.cells.push(cell);
            }
        }
        this.shapes = this.cells;
    }
}

class Text extends Shape {
    constructor(string = "undefined", x = 0, y = 0, fontSize = 20) {
        super(x, y);

        this.string = string;

        this.textAlign = "left";
        this.fontSize = fontSize;
        this.fontFamily = "Arial";
    }

    get font() {
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    setSize(n) {
        this.fontSize = n;
        return this;
    }

    setFont(n) {
        this.fontFamily = n;
        return this;
    }

    setAlign(n) {
        this.textAlign = n;
        return this;
    }

    get size() {
        return this.fontSize;
    }

    set size(n) {
        this.fontSize = n;
    }

    render(canv) {
        if (this.preRender(canv)) {
            canv.ctx.beginPath();
            canv.ctx.textAlign = this.textAlign;
            canv.ctx.font = this.font;
            this.renderRotation(canv);
            if (this.showStroke) {
                canv.ctx.lineWidth = this.strokeWidth;
                canv.ctx.strokeStyle = this.stroke.toString();
                canv.ctx.strokeText(this.string, this.x, this.fontSize + this.y);
            }

            if (this.showFill) {
                canv.ctx.fillStyle = this.color.toString();
                this.width = canv.ctx.measureText(this.string).width;
                canv.ctx.fillText(this.string, this.x, this.fontSize + this.y);
            }
            canv.ctx.closePath();
        }
    }
}


class Canv {
    static random(min, max) {
        if (Array.isArray(min)) {
            return min[Canv.random(0, min.length - 1)];
        }
        if (arguments.length === 1) {
            max = Math.floor(min);
            min = 0;
        } else if (arguments.length === 2) {
            min = Math.ceil(min);
            max = Math.floor(max);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static isMobile() {
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
    }

    map(n, start1, stop1, start2, stop2, withinBounds) {
        var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return this.constrain(newval, start2, stop2);
        } else {
            return this.constrain(newval, stop2, start2);
        }
    };

    constrain(n, low, high) {
        return Math.max(Math.min(n, high), low);
    };

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

    get draw() {
        return this.$draw;
    }

    set keyFrames(x) {
        this.$keyFrames = (n) => {
            x.bind(this)(n);
        };
    }

    set background(n) {
        this.$background = new Color(n);
        if (this.$background) {
            let bg = new Rect(0, 0, this.width, this.height);
            this.background.a = this.transition;
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

    get firstFrame() {
        return this.frames === 1;
    }


    constructor(selector, config) {
        let noSelector = true;
        if (typeof selector === "object") {
            config = selector;
            this.canvas = document.createElement("canvas");
        } else {
            noSelector = false;
            this.canvas = document.querySelector(selector);
        }
        this.ctx = this.canvas.getContext('2d');

        this.transition = 1;
        this.frames = 0;
        this.$pixels = false;
        this.$running = false;

        this.$updateDelay = 0;
        this.$drawDelay = 0;

        this.keysDown = {};

        this.width = 100;
        this.height = 100;

        this.kf_secondsPassed = 0;
        this.kf_oldTimestamp = 0;
        this.kf_timePassed = 0;
        this.kf_keyFramesList = [];

        const fns = ["setup", "update", "draw", "resize"];

        this.$easingFns = {
            easeInOutQuint(t, b, c, d) {
                if ((t /= (d / 1000) / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            easeLinear(t, b, c, d) {
                return c * t / (d / 1000) + b;
            }
        };


        this.$easingFns = {
            linear: function (n) {
                return n;
            },

            inQuad: function (n) {
                return n * n;
            },
            outQuad: function (n) {
                return n * (2 - n);
            },
            inOutQuad: function (n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n;
                return -0.5 * (--n * (n - 2) - 1);
            },
            inCube: function (n) {
                return n * n * n;
            },
            outCube: function (n) {
                return --n * n * n + 1;
            },
            inOutCube: function (n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n * n;
                return 0.5 * ((n -= 2) * n * n + 2);
            },
            inQuart: function (n) {
                return n * n * n * n;
            },
            outQuart: function (n) {
                return 1 - (--n * n * n * n);
            },
            inOutQuart: function (n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n * n * n;
                return -0.5 * ((n -= 2) * n * n * n - 2);
            },
            inQuint: function (n) {
                return n * n * n * n * n;
            },

            outQuint: function (n) {
                return --n * n * n * n * n + 1;
            },

            inOutQuint: function (n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n * n * n * n;
                return 0.5 * ((n -= 2) * n * n * n * n + 2);
            },
            inSine: function (n) {
                return 1 - Math.cos(n * Math.PI / 2);
            },
            outSine: function (n) {
                return Math.sin(n * Math.PI / 2);
            },
            inOutSine: function (n) {
                return .5 * (1 - Math.cos(Math.PI * n));
            },
            inExpo: function (n) {
                return 0 == n ? 0 : Math.pow(1024, n - 1);
            },
            outExpo: function (n) {
                return 1 == n ? n : 1 - Math.pow(2, -10 * n);
            },
            inOutExpo: function (n) {
                if (0 == n) return 0;
                if (1 == n) return 1;
                if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
                return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
            },
            inCirc: function (n) {
                return 1 - Math.sqrt(1 - n * n);
            },
            outCirc: function (n) {
                return Math.sqrt(1 - (--n * n));
            },
            inOutCirc: function (n) {
                n *= 2
                if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
                return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
            },
            inBack: function (n) {
                var s = 1.70158;
                return n * n * ((s + 1) * n - s);
            },
            outBack: function (n) {
                var s = 1.70158;
                return --n * n * ((s + 1) * n + s) + 1;
            },
            inOutBack: function (n) {
                var s = 1.70158 * 1.525;
                if ((n *= 2) < 1) return 0.5 * (n * n * ((s + 1) * n - s));
                return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
            },
            inBounce: function (n) {
                return 1 - this.outBounce(1 - n);
            },
            outBounce: function (n) {
                if (n < (1 / 2.75)) {
                    return 7.5625 * n * n;
                } else if (n < (2 / 2.75)) {
                    return 7.5625 * (n -= (1.5 / 2.75)) * n + 0.75;
                } else if (n < (2.5 / 2.75)) {
                    return 7.5625 * (n -= (2.25 / 2.75)) * n + 0.9375;
                } else {
                    return 7.5625 * (n -= (2.625 / 2.75)) * n + 0.984375;
                }
            },
            inOutBounce: function (n) {
                if (n < .5) return this.inBounce(n * 2) * .5;
                return this.outBounce(n * 2 - 1) * .5 + .5;
            },
            inElastic: function (n) {
                var s, a = 0.1,
                    p = 0.4;
                if (n === 0) return 0;
                if (n === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return -(a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
            },
            outElastic: function (n) {
                var s, a = 0.1,
                    p = 0.4;
                if (n === 0) return 0;
                if (n === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return (a * Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1);
            },
            inOutElastic: function (n) {
                var s, a = 0.1,
                    p = 0.4;
                if (n === 0) return 0;
                if (n === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                if ((n *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
                return a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
            }
        }


        if (config && typeof config === "object") {
            if (!config.width && !config.height) {
                config.fullscreen = true;
            }

            const configKeys = Object.keys(config);
            configKeys.forEach(key => {
                if (fns.includes(key)) {
                    this["$" + key] = config[key].bind(this);
                } else {
                    this[key] = config[key];
                }
            })
        }

        this.binds();
        this.background = new Color(255);
        this.start(true);

        if (noSelector) {
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
            if (this.keysDown[e.key]) {
                delete this.keysDown[e.key];
            }
        });

        window.addEventListener("keydown", e => {
            if (!this.keysDown[e.key]) {
                this.keysDown[e.key] = true;
            }
        })


        if (this.fullscreen) {
            this.resizeHandler();
        }

        window.addEventListener("resize", e => {
            if (this.fullscreen) {
                this.resizeHandler();
            }
            if (this.$resize) {
                this.$resize.bind(this)();
            }
        });



        // Set up touch events for mobile, etc
        this.canvas.addEventListener("touchstart", (e) => {
            let mousePos = this.getTouchPos(this.canvas, e);
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        }, false);
        this.canvas.addEventListener("touchend", (e) => {
            var mouseEvent = new MouseEvent("mouseup", {});
            this.canvas.dispatchEvent(mouseEvent);
        }, false);
        this.canvas.addEventListener("touchmove", (e) => {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        }, false);

        document.body.addEventListener("touchstart", (e) => {
            if (this.fullscreen && this.isMobile() && e.target == this.canvas) {
                e.preventDefault();
            }
        }, false);

        document.body.addEventListener("touchend", (e) => {
            if (this.fullscreen && this.isMobile() && e.target == this.canvas) {
                e.preventDefault();
            }
        }, false);

        document.body.addEventListener("touchmove", (e) => {
            if (this.fullscreen && this.isMobile() && e.target == this.canvas) {
                e.preventDefault();
            }
        }, false);
    }

    getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    resizeHandler() {
        if (this.fullscreen) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    start(runSetup = false) {
        if (!this.$running) {
            this.$running = true;
            if (this.$setup && runSetup) this.$setup();
            if (this.$keyFrames) this.$keyFrames.bind(this)();
            if (this.$update || this.$draw) requestAnimationFrame(this.$loop.bind(this));
        }
        return this;
    }

    keyDown(key) {
        return this.keysDown[key];
    }

    pressKey(keys, hold = 10) {
        if (typeof keys === "string") {
            keys = [keys];
        }

        keys.forEach(key => {
            if (!this.keysDown[key]) {
                this.keysDown[key] = true;
                setTimeout(() => {
                    if (this.keysDown[key]) {
                        delete this.keysDown[key];
                    }
                }, hold);
            }
        });
    }

    stop() {
        if (this.$running) {
            this.$running = false;
        }
        return this;
    }

    write(str, x, y) {
        if (x === undefined) {
            x = this.halfWidth();
        }

        if (y === undefined) {
            y = this.halfHeight();
        }

        let txt = new Text(str, x, y);
        this.add(txt);
    }

    $loop(timestamp) {
        if (this.$running) {
            this.frames++;
            if (this.$update && (this.$updateDelay === 0 || this.frames % this.$updateDelay === 0)) {
                if (this.$update) this.$update(this.frames);
            }
            this.$keyFramesUpdate(timestamp);
            if (this.$draw && (this.$drawDelay === 0 || this.frames % this.$drawDelay === 0)) {
                if (this.$draw) this.$draw(this.frames);
            }
            requestAnimationFrame(this.$loop.bind(this));
        }
    }

    // $keyFramesUpdate(timestamp) {
    //     this.kf_secondsPassed = (timestamp - this.kf_oldTimestamp) / 1000;
    //     this.kf_oldTimestamp = timestamp;
    //     this.kf_timePassed += this.kf_secondsPassed
    //     for (let i = 0; i < this.kf_keyFramesList.length; i++) {
    //         let keyFrame = this.kf_keyFramesList[i];
    //         const key = keyFrame.key;
    //         const from = keyFrame.shape[key];
    //         const to = keyFrame.to;
    //         const speed = keyFrame.speed;
    //         const fn = this.$easingFns[keyFrame.ease] || this.$easingFns["easeLinear"];

    //         keyFrame.shape[key] = fn(this.kf_timePassed, from, to - from, speed);
    //     }
    // }

    $keyFramesUpdate() {
        const now = Date.now();

        for (let i = 0; i < this.kf_keyFramesList.length; i++) {
            const config = this.kf_keyFramesList[i];

            if (now - config.start >= config.duration) {

            } else {
                Object.keys(config.vals).forEach(key => {
                    const from = config.shape[key];
                    const to = config.vals[key];
                    const p = (now - config.start) / config.duration;
                    const fn = this.$easingFns[config.ease].bind(this.$easingFns);
                    const val = fn(p);
                    config.shape[key] = config.startVals[key] + (from - to) * val;
                })
            }
        }
    }

    keyFrame(config) {
        config.start = Date.now();
        config.startVals = {};
        Object.keys(config.vals).map(key => {
            config.startVals[key] = config.shape[key];
        })

        this.kf_keyFramesList.push(config);
    }

    set updateDelay(delay) {
        if (typeof delay === "number" && delay > 0) {
            this.$updateDelay = delay;
        } else {
            this.$updateDelay = 0;
        }
    }

    set drawDelay(delay) {
        if (typeof delay === "number" && delay > 0) {
            this.$drawDelay = delay;
        } else {
            this.$drawDelay = 0;
        }
    }

    filterPixels(filter) {
        if (typeof filter === "function") {
            const pixels = this.$pixels || this.getPixels();
            for (let y = 0; y < pixels.length; y++) {
                for (let x = 0; x < pixels[y].length; x++) {
                    const color = pixels[y][x];
                    const changed = filter(color, x, y);
                    if (color.toString() !== changed.toString()) {
                        pixels[y][x] = changed;
                    }
                }
            }
            this.setPixels(pixels);
        }
    }

    invert() {
        this.filterPixels(color => {
            return color.invert()
        });
    }

    toDataURL() {
        return this.canvas.toDataURL(...arguments);
    }

    snapshot() {
        return this.toDataURL(...arguments);
    }

    getPixels(x = 0, y = 0, w = this.width, h = this.height) {
        const px = [];
        const data = this.ctx.getImageData(x, y, w, h).data;
        const l = w * h;
        for (let i = 0; i < l; i++) {
            let r = data[i * 4]; // Red
            let g = data[i * 4 + 1]; // Green
            let b = data[i * 4 + 2]; // Blue
            let a = data[i * 4 + 3]; // Alpha
            let yc = parseInt(i / w, 10);
            if (!px[yc]) {
                px[yc] = [];
            }
            let xc = i - yc * w;
            let color = new Color(r, g, b, a);
            px[yc][xc] = color;
        }

        this.$pixels = px;
        return px;
    }

    setPixels(data, x = 0, y = 0, w = this.width, h = this.height) {
        const imageData = [];
        for (let xc = 0; xc < h; xc++) {
            for (let yc = 0; yc < w; yc++) {
                const color = data[xc][yc];
                imageData.push(color.r, color.g, color.b, color.a);
            }
        }
        const clamped = new Uint8ClampedArray(imageData);
        this.ctx.putImageData(new ImageData(clamped, w, h), x, y);
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
            n.render(this);
        }
    }
}