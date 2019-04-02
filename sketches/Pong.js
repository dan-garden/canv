new Canv('canvas', {
    width: 400,
    height: 400,
    paddleWidth: 20,
    paddleHeight: 100,
    setup() {
        this.player1 = new Rect(0, this.halfHeight(this.paddleHeight), this.paddleWidth, this.paddleHeight);
        this.player1.color = new Color(255);

        this.player2 = new Rect(this.width-this.paddleWidth, this.halfHeight(this.paddleHeight), this.paddleWidth, this.paddleHeight);
        this.player2.color = new Color(255);
    },

    update() {
        if(this.keyDown("w")) {
            if(this.player1.y >= 0) {
                this.player1.y -= 3;
            }
        } 
        if(this.keyDown("s")) {
            if(this.player1.y <= this.height-this.player1.height) {
                this.player1.y += 3;
            }
        }
    },

    draw() {
        this.background = new Color(0);
        this.add(this.player1);
        this.add(this.player2);
    }
})