class Frame extends ShapeGroup {
    constructor() {
        super([]);
        this.thumbnail = false;
    }

    clone() {
        const newFrame = new Frame();
        const newObjs = [];
        this.forEach((obj, i) => {
            newObjs.unshift(obj.clone());
        })
        newFrame.shapes = newObjs;
        return newFrame;
    }
}

class PivotObj extends ShapeGroup {
    constructor(sandbox, objName) {
        super([]);
        this.sandbox = sandbox;
        this.objName = objName;
        this.x = this.sandbox.halfWidth();
        this.y = this.sandbox.halfHeight();
        this.points = [];
        this.id = this.generateId();
        this.selected = false;
        this.handles = true;
    }

    setPoints(points) {
        this.points = new ShapeGroup(points);
    }

    generateId() {
        const length = 5;
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    setShapes(shapes) {
        this.shapes = Object.values(shapes);
    }

    deselect() {
        this.selected = false;
        this.init();
    }

    select() {
        this.selected = true;
        this.init();
    }

    initHandles() {
        if(this.handles) {
            this.points.forEach((handle, i) => {
                const handleKnob = new Circle(handle.x, handle.y, 10);
                handleKnob.showFill = false;
                handleKnob.showStroke = false;
                this.add(handleKnob);
                handleKnob.addEventListener("mousedown", () => {
                    if(this.selected) {
                        if(i === 0) {
                            if(this.sandbox.mouseX > this.sandbox.mousePrevX) {
                                this.points.moveX(2);
                            } else if(this.sandbox.mouseX < this.sandbox.mousePrevX) {
                                this.points.moveX(-2);
                            }
                            if(this.sandbox.mouseY > this.sandbox.mousePrevY) {
                                this.points.moveY(2);
                            } else if(this.sandbox.mouseY < this.sandbox.mousePrevY) {
                                this.points.moveY(-2);
                            }
                        } else {
                            handle.setPos(this.sandbox.mouseX, this.sandbox.mouseY);
                            handleKnob.setPos(this.sandbox.mouseX, this.sandbox.mouseY);
                        }
                        this.init();

                        if(this.sandbox.autoFrames && this.sandbox.frames % 10 === 0) {
                            this.sandbox.addFrame();
                        }
                    } else {
                        sandbox.deselectAllObjects();
                        this.select();
                    }
                });
            })
        }
    }

    snapshot() {
        this.sandbox.snapshot();
    }

    hideHandles() {
        this.handles = false;
    }

    showHandles() {
        this.handles = true;
    }

    init() {
        this.buildShape();
        this.snapshot();
        this.initHandles();
    }

    clone() {
        const newObject = eval("new " + (this.objName || "PivotObj") + "(this.sandbox)");
        const newPoints = [];
        this.points.forEach((point, i) => {
            newPoints[i] = new Vector(point.x, point.y);
        });
        newObject.setPoints(newPoints);
        newObject.init();

        return newObject;
    }
}

class StickMan extends PivotObj {
    constructor(sandbox) {
        super(sandbox, "StickMan");

        this.thickness = 5;
        this.setPoints([
            new Vector(this.x, this.y),
            new Vector(this.x, this.y - 70),

            new Vector(this.x - 30, this.y - 40),
            new Vector(this.x - 45, this.y),
            new Vector(this.x + 30, this.y - 40),
            new Vector(this.x + 45, this.y),


            new Vector(this.x - 30, this.y + 40),
            new Vector(this.x - 45, this.y + 80),
            new Vector(this.x + 30, this.y + 40),
            new Vector(this.x + 45, this.y + 80),
        ]);

        this.init();
    }

    buildShape() {
        this.setShapes({
            head: new Circle(this.points[1].x, this.points[1].y - 20, 20)
                .noFill()
                .setStrokeWidth(this.thickness),
            body: new Line(this.points[0],this.points[1])
                .setStrokeWidth(this.thickness),
            upper_left_arm: new Line(this.points[1],this.points[2])
                .setStrokeWidth(this.thickness),
            lower_left_arm: new Line(this.points[2],this.points[3])
            .setStrokeWidth(this.thickness),
            upper_right_arm: new Line(this.points[1],this.points[4])
                .setStrokeWidth(this.thickness),
            lower_right_arm: new Line(this.points[4],this.points[5])
                .setStrokeWidth(this.thickness),
            upper_left_leg: new Line(this.points[0],this.points[6])
                .setStrokeWidth(this.thickness),
            lower_left_leg: new Line(this.points[6],this.points[7])
                .setStrokeWidth(this.thickness),
            upper_right_leg: new Line(this.points[0],this.points[8])
                .setStrokeWidth(this.thickness),
            lower_right_leg: new Line(this.points[8],this.points[9])
                .setStrokeWidth(this.thickness)
        });
    }
}

class Ball extends PivotObj {
    constructor(sandbox) {
        super(sandbox, "Ball");

        this.size = 20;

        this.setPoints([
            new Vector(this.x, this.y)
        ]);

        this.init();
    }

    buildShape() {
        this.setShapes({
            ball: new Circle(this.points[0].x, this.points[0].y, this.size)
        })
    }
}

const sandbox = new Canv('#sandbox', {
    width: 300,
    height: 400,
    setup() {
        this.$frames = [];
        this.framesDom = document.querySelector('#frames-nav');

        this.init();
    },

    init() {
        this.$frameIndex = 0;
        this.$objId = false;
        this.$playingPreview = 0;
        this.autoFrames = true;

        this.addFrame();
        this.addObj("StickMan");
    },

    snapshot() {
        const thumbnail = this.toDataURL();
        this.currentFrame().thumbnail = thumbnail;
    },

    currentFrame() {
        return this.$frames[this.$frameIndex];
    },

    toggleAutoFrames() {
        this.autoFrames = this.autoFrames ? false : true;
        document.querySelector("#auto-frames-display").innerText = this.autoFrames ? "On" : "Off";
    },

    addFrame() {
        let newFrame;
        if(this.$frames.length === 0) {
            newFrame = new Frame();
            this.$frames.push(newFrame);
        } else {
            newFrame = this.currentFrame().clone();
            this.$frames.push(newFrame);
        }

        this.addFrameLi(this.$frames.length-1);
        this.changeFrame(this.$frames.length-1);
        this.snapshot();

        return newFrame;
    },

    addFrameLi(n) {
        const li = document.createElement("li");
        li.id = "frame-" + n;
        const img = document.createElement("img");
        li.appendChild(img);
        li.classList.add("active");

        li.onclick = () => {
            this.changeFrame(n);
        };
        this.framesDom.append(li);
    },

    changeFrame(n) {
        if(this.$frames[n] && n !== this.$frameIndex) {
            this.deselectAllObjects();
            this.$frameIndex = n;
            this.$objId = false;

            Array.from(this.framesDom.querySelectorAll("li")).forEach(li => li.classList.remove("active"));
            this.framesDom.querySelector("#frame-" + this.$frameIndex).classList.add("active");
        }
    },

    deselectAllObjects() {
        this.$frames.forEach(frame => {
            frame.forEach(obj => {
                obj.deselect();
            })
        })
    },

    selectObj(n) {
        this.deselectAllObjects();
        this.$objId = n;
        this.currentFrame().forEach(obj => { 
            if(obj.id === n) {
                obj.select();
            }
        })
    },

    currentObj() {
        return this.currentFrame().shapes[this.$objIndex];
    },

    addObj(objName) {
        const obj = eval("new " + (objName || "PivotObj") + "(this)");
        this.currentFrame().add(obj);
    },

    updateThumbnails() {
        if(this.frames === 2 || this.frames % 30 === 0) {
            this.$frames.forEach((frame, i) => {
                const img = document.querySelector("#frame-"+i + " img");
                if(frame.thumbnail) {
                    img.src = frame.thumbnail;
                }
            })
        }
    },

    playPreview(interval = 3) {
        this.$preFrameIndex = this.$frameIndex;
        this.$frameIndex = 0;
        this.$playingPreview = interval;
    },

    stopPreview() {
        this.$playingPreview = 0;
        this.$frameIndex = this.$preFrameIndex;
    },

    update() {
        this.updateThumbnails();

        if(this.$playingPreview & this.frames % this.$playingPreview === 0) {
            this.$frameIndex = (this.$frameIndex + 1) % this.$frames.length;
        }
    },

    draw() {
        this.clear();
        this.add(this.currentFrame());
        if(this.frames === 1) {
            this.snapshot();
        }
    }

})