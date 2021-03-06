"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Element getters and setters (for keyframes)
HTMLElement.prototype.__defineGetter__("top", function () {
    return parseInt(this.style.top.replace("px", ""));
});
HTMLElement.prototype.__defineSetter__("top", function (val) {
    return this.style.top = val + "px";
});
HTMLElement.prototype.__defineGetter__("left", function () {
    return parseInt(this.style.left.replace("px", ""));
});
HTMLElement.prototype.__defineSetter__("left", function (val) {
    return this.style.left = val + "px";
});
HTMLElement.prototype.__defineGetter__("right", function () {
    return parseInt(this.style.right.replace("px", ""));
});
HTMLElement.prototype.__defineSetter__("right", function (val) {
    return this.style.right = val + "px";
});
HTMLElement.prototype.__defineGetter__("bottom", function () {
    return parseInt(this.style.bottom.replace("px", ""));
});
HTMLElement.prototype.__defineSetter__("bottom", function (val) {
    return this.style.bottom = val + "px";
});
HTMLElement.prototype.__defineGetter__("width", function () {
    return parseInt(this.style.width.replace("px", ""));
});
HTMLElement.prototype.__defineSetter__("width", function (val) {
    return this.style.width = val + "px";
});
HTMLElement.prototype.__defineGetter__("height", function () {
    return parseInt(this.style.height.replace("px", ""));
});
HTMLElement.prototype.__defineSetter__("height", function (val) {
    return this.style.height = val + "px";
});

var ActionRecorder = function () {
    function ActionRecorder() {
        _classCallCheck(this, ActionRecorder);

        this.actions = [];
        this.startTime = false;
        this.recording = false;
        this.lastTime = false;
    }

    _createClass(ActionRecorder, [{
        key: "export",
        value: function _export() {
            return JSON.stringify(this.actions);
        }
    }, {
        key: "import",
        value: function _import(data) {
            if (typeof data === "string") {
                this.actions = JSON.parse(data);
            } else if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
                this.actions = data;
            }
            return this;
        }
    }, {
        key: "startRecording",
        value: function startRecording() {
            this.startTime = Date.now();
            this.lastTime = Date.now();
            this.recording = true;

            return this;
        }
    }, {
        key: "replayRecording",
        value: function replayRecording(fn, cb) {
            var _this = this;

            var playMark = function playMark(playingIndex) {
                var action = _this.actions[playingIndex];
                var nextAction = _this.actions[playingIndex + 1];
                if (typeof fn === "function") {
                    fn(action.d, action.t);
                }
                if (nextAction) {
                    setTimeout(function () {
                        playMark(playingIndex + 1);
                    }, nextAction.t);
                } else {
                    if (typeof cb === "function") {
                        cb();
                    }
                }
            };
            playMark(0);
        }
    }, {
        key: "stopRecording",
        value: function stopRecording() {
            this.recording = false;
            return this;
        }
    }, {
        key: "resetRecording",
        value: function resetRecording() {
            this.actions = [];
            this.startTime = false;
            this.recording = false;
            this.lastTime = false;
            return this;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.actions = [];
            this.lastTime = Date.now();
            return this;
        }
    }, {
        key: "mark",
        value: function mark(d) {
            if (!this.recording) {
                this.startRecording();
            }
            this.actions.push({
                t: Date.now() - this.lastTime,
                d: d
            });
            this.lastTime = Date.now();
            return this;
        }
    }]);

    return ActionRecorder;
}();

var Color = function () {
    _createClass(Color, null, [{
        key: "fromHex",
        value: function fromHex(hex) {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : undefined;
        }
    }, {
        key: "fromRef",
        value: function fromRef(ref) {
            var d = document.createElement("div");
            d.style.color = ref;
            d.style.display = "none";
            document.body.appendChild(d);
            var s = window.getComputedStyle(d).color.replace("(", "").replace(")", "").replace("rgb", "");
            document.body.removeChild(d);
            var c = s.split(", ").map(function (a) {
                return parseInt(a);
            });
            return new Color(c[0], c[1], c[2]);
        }
    }, {
        key: "random",
        value: function random() {
            return new Color(Canv.random(0, 255), Canv.random(0, 255), Canv.random(0, 255));
        }
    }, {
        key: "white",
        get: function get() {
            return new Color(255);
        }
    }, {
        key: "black",
        get: function get() {
            return new Color(0);
        }
    }, {
        key: "red",
        get: function get() {
            return new Color(255, 0, 0);
        }
    }, {
        key: "green",
        get: function get() {
            return new Color(0, 255, 0);
        }
    }, {
        key: "blue",
        get: function get() {
            return new Color(0, 0, 255);
        }
    }, {
        key: "yellow",
        get: function get() {
            return new Color(255, 255, 0);
        }
    }, {
        key: "cyan",
        get: function get() {
            return new Color(0, 255, 255);
        }
    }, {
        key: "magenta",
        get: function get() {
            return new Color(255, 0, 255);
        }
    }]);

    function Color() {
        _classCallCheck(this, Color);

        if (arguments.length === 0) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 0;
        } else if (arguments.length === 1) {
            if (arguments[0] instanceof Color || _typeof(arguments[0]) === "object") {
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
                return Color.fromRef(arguments[0]);
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

    _createClass(Color, [{
        key: "toString",
        value: function toString() {
            var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "rgba";

            return type == "rgba" ? "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")" : "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        }
    }, {
        key: "componentToHex",
        value: function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
    }, {
        key: "toHex",
        value: function toHex() {
            return "#" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b);
        }
    }, {
        key: "normalize",
        value: function normalize() {
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
    }, {
        key: "shade",
        value: function shade(n) {
            this.r = this.r + n;
            this.g = this.g + n;
            this.b = this.b + n;
            return this.normalize();
        }
    }, {
        key: "setAlpha",
        value: function setAlpha(n) {
            this.a = n;
            return this;
        }
    }, {
        key: "invert",
        value: function invert() {
            this.r = 255 - this.r;
            this.g = 255 - this.g;
            this.b = 255 - this.b;
            return this;
        }
    }, {
        key: "greyscale",
        value: function greyscale() {
            var s = (this.r + this.g + this.b) / 3;
            this.r = s;
            this.g = s;
            this.b = s;
            return this;
        }
    }, {
        key: "sepia",
        value: function sepia() {
            this.r = 0.393 * this.r + 0.769 * this.g + 0.189 * this.b;
            this.g = 0.349 * this.r + 0.686 * this.g + 0.168 * this.b;
            this.b = 0.272 * this.r + 0.534 * this.g + 0.131 * this.b;
            return this;
        }
    }, {
        key: "opacity",
        value: function opacity(a) {
            this.a = a;
            return new Color(this);
        }
    }, {
        key: "randomize",
        value: function randomize() {
            var c = Color.random();
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;
            this.a = c.a;
            return this;
        }
    }, {
        key: "saturate",
        value: function saturate(value) {
            var gray = 0.2989 * this.r + 0.5870 * this.g + 0.1140 * this.b;
            this.r = -gray * value + this.r * (1 + value);
            this.g = -gray * value + this.g * (1 + value);
            this.b = -gray * value + this.b * (1 + value);
            return this.normalize();
        }
    }, {
        key: "lightOrDark",
        value: function lightOrDark() {
            if (this.hsp > 127.5) {
                return 'light';
            } else {
                return 'dark';
            }
        }
    }, {
        key: "hsp",
        get: function get() {
            var hsp = Math.sqrt(0.299 * (this.r * this.r) + 0.587 * (this.g * this.g) + 0.114 * (this.b * this.b));
            return hsp;
        }
    }]);

    return Color;
}();

var Vector = function () {
    function Vector(x, y) {
        _classCallCheck(this, Vector);

        this.x = x;
        this.y = y;
    }

    _createClass(Vector, [{
        key: "setPos",
        value: function setPos(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
    }, {
        key: "add",
        value: function add(v) {
            if (v instanceof Vector) {
                this.x += v.x;
                this.y += v.y;
            } else if (!Number.isNaN(v)) {
                this.x += v;
                this.y += v;
            }
        }
    }, {
        key: "subtract",
        value: function subtract(v) {
            if (v instanceof Vector) {
                this.x -= v.x;
                this.y -= v.y;
            } else if (!Number.isNaN(v)) {
                this.x -= v;
                this.y -= v;
            }
        }
    }, {
        key: "multi",
        value: function multi(v) {
            if (v instanceof Vector) {
                this.x *= v.x;
                this.y *= v.y;
            } else if (!Number.isNaN(v)) {
                this.x *= v;
                this.y *= v;
            }
        }
    }, {
        key: "moveX",
        value: function moveX(n) {
            this.x += n;
        }
    }, {
        key: "moveY",
        value: function moveY(n) {
            this.y += n;
        }
    }, {
        key: "clone",
        value: function clone() {
            return new Vector(this.x, this.y);
        }
    }, {
        key: "center",
        get: function get() {
            return this;
        }
    }], [{
        key: "getLine",
        value: function getLine(a, b, count) {
            count = count + 1;
            var d = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) / count;
            var fi = Math.atan2(b.y - a.y, b.x - a.x);

            var points = [];
            for (var i = 0; i <= count; ++i) {
                points.push(new Vector(a.x + i * d * Math.cos(fi), a.y + i * d * Math.sin(fi)));
            }
            return points;
        }
    }]);

    return Vector;
}();

var ShapeEventListener = function () {
    function ShapeEventListener() {
        _classCallCheck(this, ShapeEventListener);

        this.events = {};
    }

    _createClass(ShapeEventListener, [{
        key: "register",
        value: function register(type, fn) {
            if (typeof type === "string" && typeof fn === "function") {
                if (!this.exists(type)) {
                    this.events[type] = [];
                }

                this.events[type].push(fn);
            }
        }
    }, {
        key: "trigger",
        value: function trigger(type, params) {
            if (this.exists(type)) {
                this.events[type].forEach(function (event) {
                    if (params) {
                        event.apply(undefined, _toConsumableArray(params));
                    } else {
                        event();
                    }
                });
            }
        }
    }, {
        key: "exists",
        value: function exists(type) {
            return type && this.events[type];
        }
    }]);

    return ShapeEventListener;
}();

var Shape = function () {
    function Shape(x, y) {
        _classCallCheck(this, Shape);

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

    _createClass(Shape, [{
        key: "setAlpha",
        value: function setAlpha(n) {
            this.opacity = n;
        }
    }, {
        key: "noStroke",
        value: function noStroke() {
            this.showFill = true;
            this.showStroke = false;
            return this;
        }
    }, {
        key: "hide",
        value: function hide() {
            this.shown = false;
            return this;
        }
    }, {
        key: "show",
        value: function show() {
            this.shown = true;
            return this;
        }
    }, {
        key: "noFill",
        value: function noFill() {
            this.showFill = false;
            this.showStroke = true;
            return this;
        }
    }, {
        key: "setPos",
        value: function setPos(x, y) {
            this.pos.setPos(x, y);
            return this;
        }
    }, {
        key: "setDimensions",
        value: function setDimensions(w, h) {
            this.width = w;
            this.height = h;
            return this;
        }
    }, {
        key: "setColor",
        value: function setColor(n) {
            this.color = new Color(n);
            return this;
        }
    }, {
        key: "setStroke",
        value: function setStroke(n, s) {
            this.stroke = new Color(n);
            if (s) {
                this.setStrokeWidth(s);
            }
            this.showStroke = true;
            return this;
        }
    }, {
        key: "setStrokeWidth",
        value: function setStrokeWidth(n) {
            this.strokeWidth = n;
            return this;
        }
    }, {
        key: "applyConfig",
        value: function applyConfig(config) {
            var _this2 = this;

            if ((typeof config === "undefined" ? "undefined" : _typeof(config)) === "object") {
                Object.keys(config).forEach(function (configKey) {
                    _this2[configKey] = config[configKey];
                });
            }
        }
    }, {
        key: "moveX",
        value: function moveX(n) {
            this.x += n;
            return this;
        }
    }, {
        key: "moveY",
        value: function moveY(n) {
            this.y += n;
            return this;
        }
    }, {
        key: "rotate",
        value: function rotate(n) {
            this.angle += n;
            return this;
        }
    }, {
        key: "setAngle",
        value: function setAngle(n) {
            this.angle = n;
            return this;
        }
    }, {
        key: "contains",
        value: function contains() {
            return false;
        }
    }, {
        key: "addEventListener",
        value: function addEventListener(type, fn) {
            this.$events.register(type, fn);
        }
    }, {
        key: "trigger",
        value: function trigger(event, params) {
            this.$events.trigger(event, params);
        }
    }, {
        key: "preRender",
        value: function preRender(canv) {
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

            if (this.contains(canv.mouseX, canv.mouseY) && !this.$mouseover) {
                this.$mouseover = true;
                this.trigger("mouseover", [canv]);
            }

            if (this.$mouseover === true && !this.contains(canv.mouseX, canv.mouseY)) {
                this.$mouseover = false;
                this.trigger("mouseout", [canv]);
            }

            return true;
        }
    }, {
        key: "renderRotation",
        value: function renderRotation(canv) {
            var w = this.width,
                h = this.height,
                x = this.x,
                y = this.y;

            if (this.angle) {
                canv.ctx.translate(x + w / 2, y + h / 2);
                canv.ctx.rotate(this.angle * (Math.PI / 180));
                canv.ctx.translate(-(x + w / 2), -(y + h / 2));
            }
        }
    }, {
        key: "x",
        set: function set(n) {
            this.pos.x = n;
        },
        get: function get() {
            return this.pos.x;
        }
    }, {
        key: "y",
        set: function set(n) {
            this.pos.y = n;
        },
        get: function get() {
            return this.pos.y;
        }
    }, {
        key: "opacity",
        set: function set(n) {
            this.color.a = n;
        },
        get: function get() {
            return this.color.a;
        }
    }, {
        key: "center",
        get: function get() {
            return new Vector(this.x, this.y);
        }
    }], [{
        key: "centroid",
        value: function centroid(pts) {
            var first = pts[0],
                last = pts[pts.length - 1];
            if (first.x != last.x || first.y != last.y) pts.push(first);
            var twicearea = 0,
                x = 0,
                y = 0,
                nPts = pts.length,
                p1,
                p2,
                f;
            for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
                p1 = pts[i];
                p2 = pts[j];
                f = p1.x * p2.y - p2.x * p1.y;
                twicearea += f;
                x += (p1.x + p2.x) * f;
                y += (p1.y + p2.y) * f;
            }
            f = twicearea * 3;
            return new Vector(x / f, y / f);
        }
    }]);

    return Shape;
}();

var ShapeGroup = function () {
    function ShapeGroup() {
        var _this3 = this;

        var shapes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, ShapeGroup);

        Object.keys(shapes).forEach(function (shapeKey) {
            _this3[shapeKey] = shapes[shapeKey];
        });

        this.$oldPos = new Vector();
        this.$pos = new Vector();
        this.shapes = Object.values(shapes);
        this.updatePivot();
    }

    _createClass(ShapeGroup, [{
        key: "setColor",
        value: function setColor(x) {
            this.forEach(function (shape) {
                return shape.color = x;
            });
            return this;
        }
    }, {
        key: "setPivot",
        value: function setPivot(x, y) {
            if (x instanceof Vector) {
                this.$oldPos = x.clone();
                this.$pos = x.clone();
            } else {
                this.$oldPos = new Vector(x, y);
                this.$pos = new Vector(x, y);
            }
            return this;
        }
    }, {
        key: "updatePivot",
        value: function updatePivot() {
            var center = this.center;
            this.setPivot(center.x, center.y);
        }
    }, {
        key: "remove",
        value: function remove(i) {
            if (this[i]) {
                delete this[i];
            }

            this.shapes.splice(i, 1);
            this.updatePivot();
            return this;
        }
    }, {
        key: "forEach",
        value: function forEach(fn) {
            if (typeof fn === "function") {
                for (var i = this.length - 1; i >= 0; --i) {
                    fn(this.shapes[i], i);
                }
            }
            return this;
        }
    }, {
        key: "map",
        value: function map(fn) {
            if (typeof fn === "function") {
                for (var i = this.length - 1; i >= 0; --i) {
                    this.shapes[i] = fn(this.shapes[i], i);
                }
            }
            return this;
        }
    }, {
        key: "filter",
        value: function filter(fn) {
            if (typeof fn === "function") {
                for (var i = this.length - 1; i >= 0; --i) {
                    var f = fn(this.shapes[i], i);
                    if (!f) {
                        this.remove(i);
                    }
                }
            }
            return this;
        }
    }, {
        key: "noStroke",
        value: function noStroke() {
            this.forEach(function (shape) {
                return shape.noStroke();
            });
        }
    }, {
        key: "noFill",
        value: function noFill() {
            this.forEach(function (shape) {
                return shape.noFill();
            });
        }
    }, {
        key: "render",
        value: function render(canv) {
            this.forEach(function (shape) {
                return shape.render(canv);
            });
        }
    }, {
        key: "contains",
        value: function contains(x, y) {
            return Object.values(this.shapes).map(function (shape) {
                return shape.contains ? shape.contains(x, y) : false;
            }).some(function (contains) {
                return contains == true;
            });
        }
    }, {
        key: "add",
        value: function add(n, i) {
            if (typeof n === "string" && (typeof i === "undefined" ? "undefined" : _typeof(i)) === "object") {
                this[n] = i;
                this.shapes.unshift(i);
            } else {
                this.shapes.unshift(n);
            }

            var center = this.center;
            this.setPivot(center.x, center.y);
            return this;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.shapes = [];
            var center = this.center;
            this.setPivot(center.x, center.y);
            return this;
        }
    }, {
        key: "moveX",
        value: function moveX(n) {
            this.forEach(function (s) {
                s.moveX(n);
            });
        }
    }, {
        key: "moveY",
        value: function moveY(n) {
            this.forEach(function (s) {
                s.moveY(n);
            });
        }
    }, {
        key: "shrink",
        value: function shrink() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.forEach(function (s) {
                return s.size -= n;
            });
        }
    }, {
        key: "grow",
        value: function grow() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.forEach(function (s) {
                return s.size += n;
            });
        }
    }, {
        key: "rotate",
        value: function rotate() {
            var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.forEach(function (shape) {
                return shape.angle += n;
            });
            return this;
        }
    }, {
        key: "strokeWidth",
        set: function set(x) {
            this.forEach(function (shape) {
                return shape.strokeWidth = x;
            });
        }
    }, {
        key: "stroke",
        set: function set(x) {
            this.forEach(function (shape) {
                return shape.stroke = x;
            });
        }
    }, {
        key: "x",
        set: function set(n) {
            var offset = this.$oldPos.x - this.$pos.x;
            this.forEach(function (shape) {
                if (shape instanceof Triangle) {
                    shape.x1 -= offset;
                    shape.x2 -= offset;
                    shape.x3 -= offset;
                } else {
                    shape.x -= offset;
                }
            });

            this.$oldPos.x = this.$pos.x;
            this.$pos.x = n;
        },
        get: function get() {
            return this.$pos.x;
        }
    }, {
        key: "y",
        set: function set(n) {
            var offset = this.$oldPos.y - this.$pos.y;
            this.forEach(function (shape) {
                if (shape instanceof Triangle) {
                    shape.y1 -= offset;
                    shape.y2 -= offset;
                    shape.y3 -= offset;
                } else {
                    shape.y -= offset;
                }
            });

            this.$oldPos.y = this.$pos.y;
            this.$pos.y = n;
        },
        get: function get() {
            return this.$pos.y;
        }
    }, {
        key: "center",
        get: function get() {
            if (this.length === 0) {
                return new Vector(0, 0);
            } else if (this.length === 1) {
                return this.shapes[0].center;
            } else if (this.length === 2) {
                var shape1 = this.shapes[0].center;
                var shape2 = this.shapes[1].center;
                return new Vector((shape1.x + shape2.x) / 2, (shape1.y + shape2.y) / 2);
            } else if (this.length > 2) {
                var centerPoints = [];
                this.shapes.forEach(function (shape) {
                    centerPoints.push(shape.center);
                });
                return Shape.centroid(centerPoints);
            }
        }
    }, {
        key: "length",
        get: function get() {
            return this.shapes.length;
        }
    }]);

    return ShapeGroup;
}();

var Pic = function (_Shape) {
    _inherits(Pic, _Shape);

    function Pic(src) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments[3];
        var height = arguments[4];
        var fn = arguments[5];

        _classCallCheck(this, Pic);

        var _this4 = _possibleConstructorReturn(this, (Pic.__proto__ || Object.getPrototypeOf(Pic)).call(this, x, y));

        _this4.image = new Image();
        _this4.src = src;
        _this4.opacity = 1;

        _this4.$pixels = false;

        _this4.width = width;
        _this4.height = height;

        _this4.image.onload = function () {
            _this4.loaded = true;
            if (!_this4.width) {
                _this4.width = _this4.image.naturalWidth;
            }
            if (!_this4.height) {
                _this4.height = _this4.image.naturalHeight;
            }
            if (typeof fn === "function") {
                fn(_this4);
            }
        };
        return _this4;
    }

    _createClass(Pic, [{
        key: "contains",
        value: function contains(x, y) {
            return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
        }
    }, {
        key: "getPixels",
        value: function getPixels() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;

            var px = [];
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this.image, 0, 0, w, h);
            var data = ctx.getImageData(x, y, w, h).data;
            var l = w * h;
            for (var i = 0; i < l; i++) {
                var r = data[i * 4]; // Red
                var g = data[i * 4 + 1]; // Green
                var b = data[i * 4 + 2]; // Blue
                var a = data[i * 4 + 3]; // Alpha
                var yc = parseInt(i / w, 10);
                if (!px[yc]) {
                    px[yc] = [];
                }
                var xc = i - yc * w;
                var color = new Color(r, g, b, a);
                px[yc][xc] = color;
            }

            this.$pixels = px;
            return px;
        }
    }, {
        key: "render",
        value: function render(canv) {
            var _this5 = this;

            if (!this.loaded) {
                setTimeout(function () {
                    return _this5.render(canv);
                }, 0);
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
    }, {
        key: "src",
        set: function set(n) {
            this.image.src = n;
        },
        get: function get() {
            return this.image.src;
        }
    }]);

    return Pic;
}(Shape);

var Sprite = function (_ShapeGroup) {
    _inherits(Sprite, _ShapeGroup);

    function Sprite() {
        _classCallCheck(this, Sprite);

        return _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).apply(this, arguments));
    }

    _createClass(Sprite, [{
        key: "toString",
        value: function toString() {
            var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

            var canv = document.createElement("canvas");
            var id = "sprite-" + Canv.random(10000, 99999);
            canv.id = id;
            document.body.append(canv);
            var c = new Canv("#" + id, {
                width: width,
                height: height,
                fullscreen: false,
                createSprite: function createSprite(spr) {
                    this.add(spr);
                    return this.snapshot();
                }
            });
            var sprite = c.createSprite(this);
            document.body.removeChild(canv);
            return new Pic(sprite);
        }
    }]);

    return Sprite;
}(ShapeGroup);

var Point = function (_Shape2) {
    _inherits(Point, _Shape2);

    function Point(x, y) {
        _classCallCheck(this, Point);

        return _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this, x, y));
    }

    _createClass(Point, [{
        key: "render",
        value: function render(canv) {
            if (this.preRender(canv)) {
                canv.ctx.beginPath();
                canv.ctx.strokeStyle = this.color.toString();
                canv.ctx.strokeRect(this.x, this.y, 1, 1);
                canv.ctx.closePath();
            }
        }
    }]);

    return Point;
}(Shape);

var Line = function (_Shape3) {
    _inherits(Line, _Shape3);

    function Line() {
        var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var x2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        _classCallCheck(this, Line);

        var _this8 = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));

        if (x1 instanceof Vector && y1 instanceof Vector) {
            _this8.pos = x1;
            _this8.pos2 = y1;
        } else {
            _this8.pos = new Vector(x1, y1);
            _this8.pos2 = new Vector(x2, y2);
        }

        _this8.lineCap = "round";
        return _this8;
    }

    _createClass(Line, [{
        key: "moveX",
        value: function moveX(n) {
            this.pos.moveX(n);
            this.pos2.moveX(n);
        }
    }, {
        key: "moveY",
        value: function moveY(n) {
            this.pos.moveY(n);
            this.pos2.moveY(n);
        }
    }, {
        key: "contains",
        value: function contains(x, y) {
            return false;
        }
    }, {
        key: "render",
        value: function render(canv) {
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
    }, {
        key: "center",
        get: function get() {
            return new Vector((this.pos.x + this.pos2.x) / 2, (this.pos.y + this.pos2.y) / 2);
        }
    }, {
        key: "x",
        get: function get() {
            return this.x1;
        },
        set: function set(n) {
            this.x1 = n;
        }
    }, {
        key: "y",
        get: function get() {
            return this.y1;
        },
        set: function set(n) {
            this.y1 = n;
        }
    }, {
        key: "x1",
        get: function get() {
            return this.pos.x;
        },
        set: function set(n) {
            this.pos.x = n;
        }
    }, {
        key: "y1",
        get: function get() {
            return this.pos.y;
        },
        set: function set(n) {
            this.pos.y = n;
        }
    }, {
        key: "x2",
        get: function get() {
            return this.pos2.x;
        },
        set: function set(n) {
            this.pos2.x = n;
        }
    }, {
        key: "y2",
        get: function get() {
            return this.pos2.y;
        },
        set: function set(n) {
            this.pos2.y = n;
        }
    }, {
        key: "width",
        set: function set(n) {
            this.strokeWidth = n;
        },
        get: function get() {
            return this.strokeWidth;
        }
    }, {
        key: "size",
        set: function set(n) {
            this.strokeWidth = n;
        },
        get: function get() {
            return this.strokeWidth;
        }
    }, {
        key: "length",
        get: function get() {
            return new Vector(this.x2 - this.x1, this.y2 - this.y1);
        }
    }]);

    return Line;
}(Shape);

var Rect = function (_Shape4) {
    _inherits(Rect, _Shape4);

    function Rect() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
        var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;

        _classCallCheck(this, Rect);

        var _this9 = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, x, y));

        _this9.width = w;
        _this9.height = h;

        _this9.str = false;
        return _this9;
    }

    _createClass(Rect, [{
        key: "renderText",
        value: function renderText(canv) {
            this.str.setPos(this.x + this.width / 2, this.y + this.height / 2 - this.str.fontSize / 2);
            this.str.render(canv);
        }
    }, {
        key: "render",
        value: function render(canv) {
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
    }, {
        key: "intersects",
        value: function intersects(rectB) {
            var intersectTop = Math.max(this.y, rectB.y);
            var intersectRight = Math.min(this.x2, rectB.x2);
            var intersectBottom = Math.min(this.y2, rectB.y2);
            var intersectLeft = Math.max(this.x, rectB.x);

            var intersectWidth = intersectRight - intersectLeft;
            var intersectHeight = intersectBottom - intersectTop;

            if (intersectWidth > 0 && intersectHeight > 0) {
                return new Rect(intersectLeft, intersectTop, intersectWidth, intersectHeight);
            }
        }
    }, {
        key: "contains",
        value: function contains(x, y) {
            return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
        }
    }, {
        key: "text",
        set: function set(n) {
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
        },
        get: function get() {
            return this.str ? this.str.string : false;
        }
    }, {
        key: "center",
        get: function get() {
            return new Vector(this.x + this.width / 2, this.y + this.height / 2);
        }
    }, {
        key: "x2",
        get: function get() {
            return this.x + this.width;
        }
    }, {
        key: "y2",
        get: function get() {
            return this.y + this.height;
        }
    }]);

    return Rect;
}(Shape);

var Circle = function (_Shape5) {
    _inherits(Circle, _Shape5);

    function Circle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

        _classCallCheck(this, Circle);

        var _this10 = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, x, y));

        _this10.size = radius;
        return _this10;
    }

    _createClass(Circle, [{
        key: "setRadius",
        value: function setRadius(n) {
            this.size = n;
            return this;
        }
    }, {
        key: "shrink",
        value: function shrink(n) {
            this.size -= n;
        }
    }, {
        key: "grow",
        value: function grow(n) {
            this.size += n;
        }
    }, {
        key: "contains",
        value: function contains(x, y) {
            return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= this.radius * this.radius;
        }
    }, {
        key: "render",
        value: function render(canv) {
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
    }, {
        key: "radius",
        set: function set(n) {
            this.size = n;
        },
        get: function get() {
            return this.size;
        }
    }, {
        key: "center",
        get: function get() {
            return new Vector(this.x, this.y);
        }
    }]);

    return Circle;
}(Shape);

var Triangle = function (_Shape6) {
    _inherits(Triangle, _Shape6);

    function Triangle(x1, y1, x2, y2, x3, y3) {
        _classCallCheck(this, Triangle);

        var _this11 = _possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this, x1, y1));

        _this11.x2 = x2;
        _this11.y2 = y2;
        _this11.x3 = x3;
        _this11.y3 = y3;
        return _this11;
    }

    _createClass(Triangle, [{
        key: "contains",
        value: function contains(x, y) {
            return false;
        }
    }, {
        key: "render",
        value: function render(canv) {
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
    }, {
        key: "x1",
        get: function get() {
            return this.x;
        },
        set: function set(n) {
            this.x = n;
        }
    }, {
        key: "y1",
        get: function get() {
            return this.y;
        },
        set: function set(n) {
            this.y = n;
        }
    }, {
        key: "center",
        get: function get() {
            return Shape.centroid([new Vector(this.x1, this.y1), new Vector(this.x2, this.y2), new Vector(this.x3, this.y3)]);
        }
    }]);

    return Triangle;
}(Shape);

var BarGraph = function (_ShapeGroup2) {
    _inherits(BarGraph, _ShapeGroup2);

    function BarGraph(config) {
        _classCallCheck(this, BarGraph);

        var _this12 = _possibleConstructorReturn(this, (BarGraph.__proto__ || Object.getPrototypeOf(BarGraph)).call(this, {
            bounds: config.bounds || new Rect(0, 0, 100, 100),
            steps: new ShapeGroup(),
            bars: new ShapeGroup()
        }));

        _this12.label = config.label || "No Label";
        _this12.step = config.step || 1;
        _this12.gap = config.gap === undefined ? 20 : config.gap;
        _this12.shadow = config.shadow === undefined ? 2 : config.shadow;
        _this12.lines = config.lines === undefined ? true : config.lines;
        _this12.fields = config.fields || [];
        _this12.max = config.max === undefined ? "calc" : config.max;

        _this12.update();
        return _this12;
    }

    _createClass(BarGraph, [{
        key: "update",
        value: function update() {
            var _this13 = this;

            this.highest = this.max === "calc" ? Math.max.apply(Math, _toConsumableArray(this.fields.map(function (f) {
                return f.number;
            }))) : this.max;

            this.steps.shapes = [];
            this.bars.shapes = [];
            this.bounds.showStroke = false;
            this.bounds.showFill = false;
            var len = this.fields.length;
            var step = this.bounds.height / (this.highest / this.step);
            var j = 0;
            for (var i = 0; i <= this.highest; i += this.step) {
                var stepShape = new ShapeGroup();
                var stepLabel = new Text(i, this.bounds.x - 30, this.bounds.y + this.bounds.height - j * step).setSize(12).setFont("Verdana");
                stepShape.add(stepLabel);

                var stepMarker = new Rect(stepLabel.x + 20, stepLabel.y, 10, 1);
                stepShape.add(stepMarker);

                if (this.lines) {
                    var stepLine = new Rect(stepMarker.x, stepMarker.y, this.bounds.width + 20, 1).setColor(200);
                    stepShape.add(stepLine);
                }

                this.steps.add(stepShape);
                j++;
            }

            this.fields.map(function (field, i) {
                var g = _this13.gap;
                var w = _this13.bounds.width / len - g;
                var h = field.number * (_this13.bounds.height / _this13.highest);
                var x = g / 2 + _this13.bounds.x + i * (w + g);
                var y = _this13.bounds.height + _this13.bounds.y - h;
                var c = field.color;
                var s = _this13.shadow;
                var bar = new ShapeGroup({
                    shadow: new Rect(x + s, y - s, w, h + s).setColor(new Color(c).shade(-100)),
                    bar: new Rect(x, y, w, h).setColor(c),
                    text: field.label ? new Text(field.label, x, y - 2 - s).setSize(12).setFont("Verdana") : new Rect(-100, -100, 0, 0)
                });
                _this13.bars.add(bar);
            });
        }
    }]);

    return BarGraph;
}(ShapeGroup);

var Grid = function (_ShapeGroup3) {
    _inherits(Grid, _ShapeGroup3);

    function Grid(x, y, width, height, rows, cols) {
        _classCallCheck(this, Grid);

        var _this14 = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, []));

        _this14.cells = [];

        _this14.rows = rows;
        _this14.cols = cols;
        var cw = width / _this14.cols;
        var ch = height / _this14.rows;
        var white = new Color(255);
        var black = new Color(0);

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                var cx = x + i * cw;
                var cy = y + j * ch;
                var cell = new Rect(cx, cy, cw, ch);
                cell.posx = i;
                cell.posy = j;
                cell.color = white;
                cell.setStroke(1, black);
                _this14.cells.push(cell);
            }
        }
        _this14.shapes = _this14.cells;
        return _this14;
    }

    _createClass(Grid, [{
        key: "cell",
        value: function cell(x, y) {
            return this.cells[this.cols * x + y];
        }
    }]);

    return Grid;
}(ShapeGroup);

var ImageGrid = function (_ShapeGroup4) {
    _inherits(ImageGrid, _ShapeGroup4);

    function ImageGrid(x, y, width, height, rows, cols) {
        _classCallCheck(this, ImageGrid);

        var _this15 = _possibleConstructorReturn(this, (ImageGrid.__proto__ || Object.getPrototypeOf(ImageGrid)).call(this, []));

        _this15.cells = [];

        _this15.rows = rows;
        _this15.cols = cols;
        var cw = width / _this15.cols;
        var ch = height / _this15.rows;
        var white = new Color(255);
        var black = new Color(0);

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                var cx = x + i * cw;
                var cy = y + j * ch;
                var cell = new Pic(null, cx, cy, cw, ch);
                cell.posx = i;
                cell.posy = j;
                cell.setStroke(1, black);
                _this15.cells.push(cell);
            }
        }
        _this15.shapes = _this15.cells;
        return _this15;
    }

    return ImageGrid;
}(ShapeGroup);

var Text = function (_Shape7) {
    _inherits(Text, _Shape7);

    function Text() {
        var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "undefined";
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var fontSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;

        _classCallCheck(this, Text);

        var _this16 = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, x, y));

        _this16.string = string;

        _this16.textAlign = "left";
        _this16.fontSize = fontSize;
        _this16.fontFamily = "Arial";
        return _this16;
    }

    _createClass(Text, [{
        key: "setSize",
        value: function setSize(n) {
            this.fontSize = n;
            return this;
        }
    }, {
        key: "setFont",
        value: function setFont(n) {
            this.fontFamily = n;
            return this;
        }
    }, {
        key: "setAlign",
        value: function setAlign(n) {
            this.textAlign = n;
            return this;
        }
    }, {
        key: "render",
        value: function render(canv) {
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
    }, {
        key: "font",
        get: function get() {
            return this.fontSize + "px " + this.fontFamily;
        }
    }, {
        key: "size",
        get: function get() {
            return this.fontSize;
        },
        set: function set(n) {
            this.fontSize = n;
        }
    }]);

    return Text;
}(Shape);

var Canv = function () {
    function Canv(selector, config) {
        var _this17 = this;

        _classCallCheck(this, Canv);

        var noSelector = true;
        if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) === "object") {
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
        this.mouseOver = true;
        this.mouseUp = false;
        this.clicked = false;
        this.keyframeStart = false;

        this.keysDown = {};

        this.width = 100;
        this.height = 100;
        this.mouse = new Vector(0, 0);

        this.kf_secondsPassed = 0;
        this.kf_oldTimestamp = 0;
        this.kf_timePassed = 0;
        this.kf_keyFramesList = [];

        var fns = ["setup", "update", "draw", "resize"];

        this.$easingFns = {
            easeInOutQuint: function easeInOutQuint(t, b, c, d) {
                if ((t /= d / 1000 / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            easeLinear: function easeLinear(t, b, c, d) {
                return c * t / (d / 1000) + b;
            }
        };

        this.$easingFns = {
            linear: function linear(n) {
                return n;
            },

            inQuad: function inQuad(n) {
                return n * n;
            },
            outQuad: function outQuad(n) {
                return n * (2 - n);
            },
            inOutQuad: function inOutQuad(n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n;
                return -0.5 * (--n * (n - 2) - 1);
            },
            inCube: function inCube(n) {
                return n * n * n;
            },
            outCube: function outCube(n) {
                return --n * n * n + 1;
            },
            inOutCube: function inOutCube(n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n * n;
                return 0.5 * ((n -= 2) * n * n + 2);
            },
            inQuart: function inQuart(n) {
                return n * n * n * n;
            },
            outQuart: function outQuart(n) {
                return 1 - --n * n * n * n;
            },
            inOutQuart: function inOutQuart(n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n * n * n;
                return -0.5 * ((n -= 2) * n * n * n - 2);
            },
            inQuint: function inQuint(n) {
                return n * n * n * n * n;
            },

            outQuint: function outQuint(n) {
                return --n * n * n * n * n + 1;
            },

            inOutQuint: function inOutQuint(n) {
                n *= 2;
                if (n < 1) return 0.5 * n * n * n * n * n;
                return 0.5 * ((n -= 2) * n * n * n * n + 2);
            },
            inSine: function inSine(n) {
                return 1 - Math.cos(n * Math.PI / 2);
            },
            outSine: function outSine(n) {
                return Math.sin(n * Math.PI / 2);
            },
            inOutSine: function inOutSine(n) {
                return .5 * (1 - Math.cos(Math.PI * n));
            },
            inExpo: function inExpo(n) {
                return 0 == n ? 0 : Math.pow(1024, n - 1);
            },
            outExpo: function outExpo(n) {
                return 1 == n ? n : 1 - Math.pow(2, -10 * n);
            },
            inOutExpo: function inOutExpo(n) {
                if (0 == n) return 0;
                if (1 == n) return 1;
                if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
                return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
            },
            inCirc: function inCirc(n) {
                return 1 - Math.sqrt(1 - n * n);
            },
            outCirc: function outCirc(n) {
                return Math.sqrt(1 - --n * n);
            },
            inOutCirc: function inOutCirc(n) {
                n *= 2;
                if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
                return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
            },
            inBack: function inBack(n) {
                var s = 1.70158;
                return n * n * ((s + 1) * n - s);
            },
            outBack: function outBack(n) {
                var s = 1.70158;
                return --n * n * ((s + 1) * n + s) + 1;
            },
            inOutBack: function inOutBack(n) {
                var s = 1.70158 * 1.525;
                if ((n *= 2) < 1) return 0.5 * (n * n * ((s + 1) * n - s));
                return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
            },
            inBounce: function inBounce(n) {
                return 1 - this.outBounce(1 - n);
            },
            outBounce: function outBounce(n) {
                if (n < 1 / 2.75) {
                    return 7.5625 * n * n;
                } else if (n < 2 / 2.75) {
                    return 7.5625 * (n -= 1.5 / 2.75) * n + 0.75;
                } else if (n < 2.5 / 2.75) {
                    return 7.5625 * (n -= 2.25 / 2.75) * n + 0.9375;
                } else {
                    return 7.5625 * (n -= 2.625 / 2.75) * n + 0.984375;
                }
            },
            inOutBounce: function inOutBounce(n) {
                if (n < .5) return this.inBounce(n * 2) * .5;
                return this.outBounce(n * 2 - 1) * .5 + .5;
            },
            inElastic: function inElastic(n) {
                var s,
                    a = 0.1,
                    p = 0.4;
                if (n === 0) return 0;
                if (n === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return -(a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
            },
            outElastic: function outElastic(n) {
                var s,
                    a = 0.1,
                    p = 0.4;
                if (n === 0) return 0;
                if (n === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return a * Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
            },
            inOutElastic: function inOutElastic(n) {
                var s,
                    a = 0.1,
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
        };

        if (config && (typeof config === "undefined" ? "undefined" : _typeof(config)) === "object") {
            if (!config.width && !config.height) {
                config.fullscreen = true;
            }

            var configKeys = Object.keys(config);
            configKeys.forEach(function (key) {
                if (fns.includes(key)) {
                    _this17["$" + key] = config[key].bind(_this17);
                } else {
                    _this17[key] = config[key];
                }
            });
        }

        this.binds();
        this.background = new Color(255);
        this.start(true);

        if (noSelector) {
            return this.canvas;
        }
    }

    _createClass(Canv, [{
        key: "getMousePos",
        value: function getMousePos(e) {
            var rect = this.canvas.getBoundingClientRect();
            return new Vector(e.clientX - rect.left, e.clientY - rect.top);
        }
    }, {
        key: "binds",
        value: function binds() {
            var _this18 = this;

            this.canvas.addEventListener("mousedown", function (e) {
                _this18.mouseDown = true;
                _this18.mouseUp = false;
                _this18.mouse = _this18.getMousePos(e);

                _this18.mouseX = _this18.mouse.x;
                _this18.mouseY = _this18.mouse.y;
            });

            this.canvas.addEventListener("mouseup", function (e) {
                _this18.mouseDown = false;
                _this18.mouseUp = true;
            });

            this.canvas.addEventListener("click", function (e) {
                _this18.clicked = true;
            });

            this.canvas.addEventListener("mousemove", function (e) {
                _this18.mousePrevX = _this18.mouseX;
                _this18.mousePrevY = _this18.mouseY;

                _this18.prevMouse = _this18.mouse;

                _this18.mouse = _this18.getMousePos(e);

                _this18.mouseX = _this18.mouse.x;
                _this18.mouseY = _this18.mouse.y;
            });

            this.canvas.addEventListener("mouseover", function (e) {
                _this18.mouseOver = true;
            });

            this.canvas.addEventListener("mouseout", function (e) {
                _this18.mouseOver = true;
                _this18.mouseDown = false;
            });

            window.addEventListener("keyup", function (e) {
                if (_this18.keysDown[e.key]) {
                    delete _this18.keysDown[e.key];
                }
            });

            window.addEventListener("keydown", function (e) {
                if (!_this18.keysDown[e.key]) {
                    _this18.keysDown[e.key] = true;
                }
            });

            if (this.fullscreen) {
                this.resizeHandler();
            }

            window.addEventListener("resize", function (e) {
                if (_this18.fullscreen) {
                    _this18.resizeHandler();
                }
                if (_this18.$resize) {
                    _this18.$resize.bind(_this18)();
                }
            });

            // Set up touch events for mobile, etc
            this.canvas.addEventListener("touchstart", function (e) {
                var mousePos = _this18.getTouchPos(_this18.canvas, e);
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                _this18.canvas.dispatchEvent(mouseEvent);
            }, false);
            this.canvas.addEventListener("touchend", function (e) {
                var mouseEvent = new MouseEvent("mouseup", {});
                _this18.canvas.dispatchEvent(mouseEvent);
            }, false);
            this.canvas.addEventListener("touchmove", function (e) {
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                _this18.canvas.dispatchEvent(mouseEvent);
            }, false);

            document.body.addEventListener("touchstart", function (e) {
                if (_this18.fullscreen && _this18.isMobile() && e.target == _this18.canvas) {
                    e.preventDefault();
                }
            }, false);

            document.body.addEventListener("touchend", function (e) {
                if (_this18.fullscreen && _this18.isMobile() && e.target == _this18.canvas) {
                    e.preventDefault();
                }
            }, false);

            document.body.addEventListener("touchmove", function (e) {
                if (_this18.fullscreen && _this18.isMobile() && e.target == _this18.canvas) {
                    e.preventDefault();
                }
            }, false);
        }
    }, {
        key: "getTouchPos",
        value: function getTouchPos(canvasDom, touchEvent) {
            var rect = canvasDom.getBoundingClientRect();
            return {
                x: touchEvent.touches[0].clientX - rect.left,
                y: touchEvent.touches[0].clientY - rect.top
            };
        }
    }, {
        key: "resizeHandler",
        value: function resizeHandler() {
            if (this.fullscreen) {
                this.width = window.innerWidth;
                this.height = window.innerHeight - 2.8;
            }
        }
    }, {
        key: "start",
        value: function start() {
            var runSetup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this.$running) {
                this.$running = true;
                if (this.$setup && runSetup) this.$setup();
                if (this.$keyframes) this.$keyframes.bind(this)();
                if (this.$update || this.$draw || this.keyframeStart) requestAnimationFrame(this.$loop.bind(this));
            }
            return this;
        }
    }, {
        key: "keyDown",
        value: function keyDown(key) {
            return this.keysDown[key];
        }
    }, {
        key: "pressKey",
        value: function pressKey(keys) {
            var _this19 = this;

            var hold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

            if (typeof keys === "string") {
                keys = [keys];
            }

            keys.forEach(function (key) {
                if (!_this19.keysDown[key]) {
                    _this19.keysDown[key] = true;
                    setTimeout(function () {
                        if (_this19.keysDown[key]) {
                            delete _this19.keysDown[key];
                        }
                    }, hold);
                }
            });
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.$running) {
                this.$running = false;
            }
            return this;
        }
    }, {
        key: "write",
        value: function write(str, x, y) {
            if (x === undefined) {
                x = this.halfWidth();
            }

            if (y === undefined) {
                y = this.halfHeight();
            }

            var txt = new Text(str, x, y);
            this.add(txt);
        }
    }, {
        key: "$loop",
        value: function $loop(timestamp) {
            if (this.$running) {
                this.frames++;

                if (this.$update && (this.$updateDelay === 0 || this.frames % this.$updateDelay === 0)) {
                    if (this.$update) this.$update(this.frames, timestamp);
                }
                this.$keyFramesUpdate(timestamp);
                if (this.$draw && (this.$drawDelay === 0 || this.frames % this.$drawDelay === 0)) {
                    if (this.$draw) this.$draw(this.frames, timestamp);
                }

                if (this.clicked) {
                    this.clicked = false;
                }
                if (this.mouseUp) {
                    this.mouseUp = false;
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

    }, {
        key: "$keyFramesUpdate",
        value: function $keyFramesUpdate() {
            var _this20 = this;

            var now = Date.now();

            var _loop = function _loop(i) {
                var config = _this20.kf_keyFramesList[i];
                if (now - config.shape.kf_start >= config.duration) {
                    Object.keys(config.vals).forEach(function (key) {
                        var from = config.shape.kf_startVals[key];
                        var to = config.vals[key];
                        config.shape[key] = to;
                        if (typeof config.shape.kf_callback === "function") {
                            config.shape.kf_callback(config.shape);
                            _this20.kf_keyFramesList.splice(config.index, 1);
                        }

                        if (typeof config.shape.kf_resolve === "function") {
                            config.shape.kf_resolve();
                        }
                    });
                } else {
                    Object.keys(config.vals).forEach(function (key) {
                        var from = config.shape.kf_startVals[key];
                        var to = config.vals[key];
                        var p = (now - config.shape.kf_start) / config.duration;
                        var fn = _this20.$easingFns[config.ease].bind(_this20.$easingFns);
                        var val = fn(p);
                        config.shape[key] = from + (to - from) * val;
                    });
                }
            };

            for (var i = 0; i < this.kf_keyFramesList.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: "animate",
        value: function animate(config) {
            var _arguments = arguments,
                _this21 = this;

            this.keyframeStart = true;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {

                    if (_arguments.length > 1) {
                        config.shape = _arguments[0];
                        config.vals = _arguments[1];
                        config.duration = _arguments[2];
                        config.ease = _arguments[3] || "linear";
                        config.callback = _arguments[4] || function () {};
                    }

                    config.shape.kf_start = Date.now();
                    config.shape.kf_startVals = {};
                    config.shape.kf_callback = config.callback;
                    config.shape.kf_resolve = resolve;
                    Object.keys(config.vals).map(function (key) {
                        config.shape.kf_startVals[key] = config.shape[key];
                    });

                    config.index = _this21.kf_keyFramesList.length;
                    _this21.kf_keyFramesList.push(config);
                }, 0);
            });
        }
    }, {
        key: "filterPixels",
        value: function filterPixels(filter) {
            if (typeof filter === "function") {
                var pixels = this.$pixels || this.getPixels();
                for (var y = 0; y < pixels.length; y++) {
                    for (var x = 0; x < pixels[y].length; x++) {
                        var color = pixels[y][x];
                        var changed = filter(color, x, y);
                        if (color.toString() !== changed.toString()) {
                            pixels[y][x] = changed;
                        }
                    }
                }
                this.setPixels(pixels);
            }
        }
    }, {
        key: "invert",
        value: function invert() {
            this.filterPixels(function (color) {
                return color.invert();
            });
        }
    }, {
        key: "toDataURL",
        value: function toDataURL() {
            var _canvas;

            return (_canvas = this.canvas).toDataURL.apply(_canvas, arguments);
        }
    }, {
        key: "snapshot",
        value: function snapshot() {
            return this.toDataURL.apply(this, arguments);
        }
    }, {
        key: "getPixels",
        value: function getPixels() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;

            var px = [];
            var data = this.ctx.getImageData(x, y, w, h).data;
            var l = w * h;
            for (var i = 0; i < l; i++) {
                var r = data[i * 4]; // Red
                var g = data[i * 4 + 1]; // Green
                var b = data[i * 4 + 2]; // Blue
                var a = data[i * 4 + 3]; // Alpha
                var yc = parseInt(i / w, 10);
                if (!px[yc]) {
                    px[yc] = [];
                }
                var xc = i - yc * w;
                var color = new Color(r, g, b, a);
                px[yc][xc] = color;
            }

            this.$pixels = px;
            return px;
        }
    }, {
        key: "setPixels",
        value: function setPixels(data) {
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.width;
            var h = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.height;

            var imageData = [];
            for (var xc = 0; xc < h; xc++) {
                for (var yc = 0; yc < w; yc++) {
                    var color = data[xc][yc];
                    imageData.push(color.r, color.g, color.b, color.a);
                }
            }
            var clamped = new Uint8ClampedArray(imageData);
            this.ctx.putImageData(new ImageData(clamped, w, h), x, y);
        }
    }, {
        key: "setDimensions",
        value: function setDimensions(w, h) {
            this.width = w;
            this.height = h;
        }
    }, {
        key: "halfWidth",
        value: function halfWidth(n) {
            return n ? this.width / 2 - n / 2 : this.width / 2;
        }
    }, {
        key: "halfHeight",
        value: function halfHeight(n) {
            return n ? this.height / 2 - n / 2 : this.height / 2;
        }
    }, {
        key: "clear",
        value: function clear() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.width;
            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.height;

            this.ctx.clearRect(x, y, w, h);
        }
    }, {
        key: "add",
        value: function add(n) {
            if (n) {
                n.render(this);
            }
        }
    }, {
        key: "map",
        value: function map(n, start1, stop1, start2, stop2, withinBounds) {
            var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
            if (!withinBounds) {
                return newval;
            }
            if (start2 < stop2) {
                return this.constrain(newval, start2, stop2);
            } else {
                return this.constrain(newval, stop2, start2);
            }
        }
    }, {
        key: "constrain",
        value: function constrain(n, low, high) {
            return Math.max(Math.min(n, high), low);
        }
    }, {
        key: "updateDelay",
        set: function set(delay) {
            if (typeof delay === "number" && delay > 0) {
                this.$updateDelay = delay;
            } else {
                this.$updateDelay = 0;
            }
        }
    }, {
        key: "drawDelay",
        set: function set(delay) {
            if (typeof delay === "number" && delay > 0) {
                this.$drawDelay = delay;
            } else {
                this.$drawDelay = 0;
            }
        }
    }, {
        key: "width",
        set: function set(x) {
            this.canvas.width = x;
        },
        get: function get() {
            return this.canvas.width;
        }
    }, {
        key: "height",
        set: function set(x) {
            this.canvas.height = x;
        },
        get: function get() {
            return this.canvas.height;
        }
    }, {
        key: "setup",
        set: function set(x) {
            this.$setup = function () {
                x();
            };
        }
    }, {
        key: "update",
        set: function set(x) {
            this.$update = function (n) {
                x(n);
            };
        }
    }, {
        key: "draw",
        set: function set(x) {
            this.$draw = function (n) {
                x(n);
            };
        },
        get: function get() {
            return this.$draw;
        }
    }, {
        key: "keyframes",
        set: function set(x) {
            var _this22 = this;

            this.$keyframes = function (n) {
                x.bind(_this22)(n);
            };
        },
        get: function get() {
            return this.$keyframes;
        }
    }, {
        key: "background",
        set: function set(n) {
            this.$background = new Color(n);
            if (this.$background) {
                var bg = new Rect(0, 0, this.width, this.height);
                this.background.a = this.transition;
                bg.color = this.background;
                this.add(bg);
            }
        },
        get: function get() {
            return this.$background;
        }
    }, {
        key: "randomWidth",
        get: function get() {
            return Canv.random(0, this.width);
        }
    }, {
        key: "randomHeight",
        get: function get() {
            return Canv.random(0, this.height);
        }
    }, {
        key: "firstFrame",
        get: function get() {
            return this.frames === 1;
        }
    }], [{
        key: "randomFloat",
        value: function randomFloat(min, max) {
            return (Math.random() * (max - min) + min).toFixed(4);
        }
    }, {
        key: "random",
        value: function random(min, max) {
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
    }, {
        key: "isMobile",
        value: function isMobile() {
            return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))
            );
        }
    }]);

    return Canv;
}();