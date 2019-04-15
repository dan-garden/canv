class Person extends ShapeGroup {
    constructor(x, y) {
        super({
            head: new Circle,
            eye: new Circle,
            body: new Line,
            left_arm: new Line,
            right_arm: new Line,
            left_leg: new Line,
            right_leg: new Line
        });

        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.walking = false;

        this.update();
    }

    update(frames) {

        this.head.x = this.x;
        this.head.y = this.y;
        this.head.radius = 10;

        this.eye.x = (this.prevX > this.x) ? this.x - 3 : this.x + 3;
        this.eye.y = this.y - 2;
        this.eye.radius = 2;
        this.eye.color = new Color(255);

        this.body.x1 = this.x;
        this.body.y1 = this.y;
        this.body.x2 = this.x;
        this.body.y2 = this.y + 40;

        this.left_arm.x1 = this.x;
        this.left_arm.y1 = this.y + 20;
        this.left_arm.x2 = this.x - 15;
        this.left_arm.y2 = this.y + 15;

        this.right_arm.x1 = this.x;
        this.right_arm.y1 = this.y + 20;
        this.right_arm.x2 = this.x + 15;
        this.right_arm.y2 = this.y + 15;

        this.left_leg.x1 = this.x;
        this.left_leg.y1 = this.y + 40;
        this.left_leg.x2 = this.x + (this.walking ? (frames % 20) : 5);
        this.left_leg.y2 = this.y + 50;

        this.right_leg.x1 = this.x;
        this.right_leg.y1 = this.y + 40;
        this.right_leg.x2 = this.x - (this.walking ? (frames % 20) : 5);
        this.right_leg.y2 = this.y + 50;

        this.prevX = this.x;
        this.prevY = this.y;
    }
}


new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.ground = new Rect(0, this.height-30, this.width, 30);
        this.ground.walk = this.ground.height + 50;
        this.person = new Person(this.width / 2, this.ground.walk);
    },

    update() {
        if(this.keyDown("a")) {
            this.person.x--;
            this.person.walking = true;
        } else if(this.keyDown("d")) {
            this.person.x++;
            this.person.walking = true;
        }
        else {
            this.person.walking = false;
        }


        if(this.keyDown(" ")) {
            this.person.y -= 2;
        } else {

            if(this.person.y >=  this.ground.walk) {
                this.person.y = this.ground.walk;
            } else {
                this.person.y += 2;
            }
        }

        this.person.update(this.frames);
    },

    draw() {
        this.clear();
        this.add(this.ground);
        this.add(this.person);
    }
})