new Canv('canvas', {
    width: 400,
    height: 400,
    paddleWidth: 20,
    paddleHeight: 100,
    setup() {
        this.player1 = new Rect(0, this.halfHeight(this.paddleHeight), this.paddleWidth, this.paddleHeight);
        this.player1.color = "white";

        this.player2 = new Rect(this.width-this.paddleWidth, this.halfHeight(this.paddleHeight), this.paddleWidth, this.paddleHeight);
        this.player2.color = "white";
    },

    update() {
        if(this.keyDown === "w") {
            this.player1.y -= 3;
        } else if(this.keyDown === "s") {
            this.player1.y += 3;
        }
    },

    draw() {
        this.background = "black";
        this.add(this.player1);
        this.add(this.player2);
    }
})