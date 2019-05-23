class PivotObj extends ShapeGroup {
    constructor(sandbox) {
        super([]);
        this.sandbox = sandbox;
        this.x = this.sandbox.halfWidth();
        this.y = this.sandbox.halfHeight();
        this.points = [];
        this.selected = false;
    }

    setPoints(points) {
        this.points = new ShapeGroup(points);
    }

    setShapes(shapes) {
        this.shapes = Object.values(shapes);
    }

    deselect() {
        this.selected = false;
        this.initHandles();
    }

    select() {
        this.selected = true;
        this.initHandles();
    }

    initHandles() {
        this.points.forEach((handle, i) => {
            let color;
            if(this.selected) {
                color = i === 0 ? "orange" : "red";
            } else {
                color = "blue";
            }
            const handleKnob = new Circle(handle.x, handle.y, 10).setColor(color);
            this.add(handleKnob);

            if(i === 0) {
                handleKnob.addEventListener("mousedown", () => {
                    if(this.sandbox.mouseX > this.sandbox.mousePrevX) {
                        this.points.moveX(1);
                    } else if(this.sandbox.mouseX < this.sandbox.mousePrevX) {
                        this.points.moveX(-1);
                    }

                    if(this.sandbox.mouseY > this.sandbox.mousePrevY) {
                        this.points.moveY(1);
                    } else if(this.sandbox.mouseY < this.sandbox.mousePrevY) {
                        this.points.moveY(-1);
                    }

                    this.init();
                })
            } else {
                handleKnob.addEventListener("mousedown", () => {
                    handle.setPos(this.sandbox.mouseX, this.sandbox.mouseY);
                    handleKnob.setPos(this.sandbox.mouseX, this.sandbox.mouseY);
    
                    this.init();
                })
            }
        })
    }

    init() {
        this.buildShape();
        this.initHandles();
    }
}

class StickMan extends PivotObj {
    constructor(sandbox) {
        super(sandbox);

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


const sandbox = new Canv('#sandbox', {
    width: 600,
    height: 600,
    setup() {
        this.$frames = [new ShapeGroup()];
        this.$frameIndex = 0;
        this.$objIndex = 0;

        this.startDefaults();
    },

    startDefaults() {
        this.addObj(new StickMan(this));
    },

    currentFrame() {
        return this.$frames[this.$frameIndex];
    },

    cloneFrame() {
        const newFrame = new ShapeGroup();
        
        return newFrame;
    },

    addFrame() {
        this.$frameIndex = this.$frames.length;
        this.$frames.push(this.cloneFrame());
    },

    selectFrame(n) {
        this.$frameIndex = n;
        this.$objIndex = 0;
    },

    selectObj(n) {
        this.$objIndex = n;
    },

    currentObj() {
        return this.currentFrame().shapes[this.$objIndex];
    },

    addObj(obj) {
        this.currentFrame().add(obj);
    },


    draw() {
        this.clear();
        this.add(this.currentFrame());
    }

})