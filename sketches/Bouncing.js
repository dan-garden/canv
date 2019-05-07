new Canv('canvas', {
    setup() {
        this.location = new Vector(100, 100);
        this.velocity = new Vector(1.5, 2.1);
        this.gravity = new Vector(0, 0.2);

        this.ball = new Rect(0, 0, 5);
        this.ball.color = "#FFF";
    },


    update() {
        this.location.add(this.velocity);
        this.velocity.add(this.gravity);
        
        if((this.location.x > this.width) || this.location.x < 0) {
            this.velocity.x *= -1;
        }

        if(this.location.y > this.height) {
            this.velocity.y *= -0.95;
            this.location.y = this.height;
        }

        this.ball.x = this.location.x;
        this.ball.y = this.location.y;
    },


    draw() {
        this.background = 0;
        this.add(this.ball);
    }
})