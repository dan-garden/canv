const app = new Canv('canvas', {
    setup() {
        this.multi = 20;
        this.ballHeight = 0;
        this.ballSize = 0.1;

        this.color = new Color(18, 128, 70);

        this.updateCourt();

        this.ball = new Circle(this.halfWidth() - 100, this.halfHeight() + 100, 0).setColor("yellow");

        this.canvas.addEventListener("click", e => {
            this.hitBall();
        })

    },

    updateCourt() {
        this.lineW = 0.0762 * this.multi;
        this.courtH = 23.77 * this.multi;
        this.singlesW = 8.23 * this.multi;
        this.serviceW = 4.115 * this.multi;
        this.serviceH = 6.4 * this.multi;
        this.sideW = 1.372 * this.multi;
        this.baseH = 5.49 * this.multi;
        this.courtW = this.singlesW + (this.sideW * 2)


        const net = new Rect(this.lineW + this.sideW, this.lineW + this.baseH + this.serviceH - this.lineW, this.singlesW, this.lineW).setColor(255);
        
        const singles_sideline = new ShapeGroup({
            left: new ShapeGroup({
                top: new Rect(this.lineW, this.lineW, this.sideW, (this.courtH / 2) - (this.lineW)).setColor(this.color).setStroke(255, this.lineW * 2),
                bottom: new Rect(this.lineW, this.lineW + (this.courtH / 2) - (this.lineW), this.sideW, (this.courtH / 2) + (this.lineW)).setColor(this.color).setStroke(255, this.lineW * 2),
            }),
            right: new ShapeGroup({

                top: new Rect(this.courtW - this.sideW + this.lineW, this.lineW, this.sideW, (this.courtH / 2) - (this.lineW)).setColor(this.color).setStroke(255, this.lineW * 2),
                bottom: new Rect(this.courtW - this.sideW + this.lineW, this.lineW + (this.courtH / 2) - (this.lineW), this.sideW, (this.courtH / 2) + (this.lineW)).setColor(this.color).setStroke(255, this.lineW * 2),
            })
        });

        const base = new ShapeGroup({
            top: new Rect(this.lineW + this.sideW, this.lineW, this.singlesW, this.baseH).setColor(this.color).setStroke(255, this.lineW * 2),
            bottom: new Rect(this.lineW + this.sideW, this.courtH - this.baseH + this.lineW, this.singlesW, this.baseH).setColor(this.color).setStroke(255, this.lineW * 2),
        });

        const service = new ShapeGroup({
            top: new ShapeGroup({
                left: new Rect(this.lineW + this.sideW, this.lineW + this.baseH, this.serviceW, this.serviceH - this.lineW).setStroke(255, this.lineW * 2).setColor(this.color).setStroke(255, this.lineW * 2),
                right: new Rect(this.lineW + this.sideW + this.serviceW, this.lineW + this.baseH, this.serviceW, this.serviceH - this.lineW).setStroke(255, this.lineW * 2).setColor(this.color).setStroke(255, this.lineW * 2),
            }),
            
        });

        const court = new Rect(this.lineW, this.lineW, this.courtW, this.courtH).setColor(this.color).setStroke(255, this.lineW * 2);

        this.court = new ShapeGroup({
            net,
            singles_sideline,
            base,
            service,
            court,
        })
    },

    hitBall() {
        this.animate(this, {
            ballHeight: 10
        }, 1000, "outSine", () => {
            this.animate(this, {
                ballHeight: 0
            }, 2000, "outBounce", () => {})
        })
    },

    update() {
        this.ball.x = this.mouseX;
        this.ball.y = this.mouseY;
        this.ball.size = this.multi * this.ballSize * (this.ballHeight + 1);
    },

    draw() {
        this.background = 0;
        this.add(this.court);
        this.add(this.ball);
    }
})