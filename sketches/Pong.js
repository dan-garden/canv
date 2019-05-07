const pong = new Canv('canvas', {
    width: 400,
    height: 400,
    paddleWidth: 20,
    paddleHeight: 100,
    moveSpeed: 3,
    setup() {
        this.player1 = new Rect(10, this.halfHeight(this.paddleHeight), this.paddleWidth, this.paddleHeight);
        this.player1.color = new Color(255);

        this.player2 = new Rect(this.width-this.paddleWidth-10, this.halfHeight(this.paddleHeight), this.paddleWidth, this.paddleHeight);
        this.player2.color = new Color(255);
    },

    update() {
        if(this.keyDown("w")) {
            if(this.player1.y >= 0) {
                this.player1.y -= this.moveSpeed;
            }
        } 
        if(this.keyDown("s")) {
            if(this.player1.y <= this.height-this.player1.height) {
                this.player1.y += this.moveSpeed;
            }
        }

        if(this.keyDown("ArrowUp")) {
            if(this.player2.y >= 0) {
                this.player2.y -= this.moveSpeed;
            }
        } 
        if(this.keyDown("ArrowDown")) {
            if(this.player2.y <= this.height-this.player2.height) {
                this.player2.y += this.moveSpeed;
            }
        }
    },

    draw() {
        this.background = new Color(0);
        this.add(this.player1);
        this.add(this.player2);
    }
})