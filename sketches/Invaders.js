const game = new Canv('canvas', {
    fullscreen: true,
    playerSpeed: 5,
    enemyRows: 5,
    enemyCols: 10,
    setup() {
        this.player = new Rect(
            this.halfWidth(100),
            this.height - 30,
            100,
            20
        ).setColor(new Color(255));


        this.bullets = new ShapeGroup();
        this.addEnemies();
    },


    addEnemies() {
        this.enemies = new ShapeGroup();

        let rowGap = 10;
        let colGap = 20;
        
        for(let i = 0; i < this.enemyCols; i++) {
            for(let j = 0; j < this.enemyRows; j++) {

                let w = 50;
                let h = 30;

                let x = (i * (w + colGap));
                let y = (j * (h + rowGap));

                let enemy = new Rect(x, y, w, h);
                enemy.color = new Color(255, 255, 255);
                this.enemies.add(enemy);
            }
        }
    },


    update() {
        this.player.setPos(
            this.player.x,
            this.height - 30
        );
        if(this.keyDown('a')) {
            if(this.player.x >= 0) {
                this.player.moveX(-this.playerSpeed);
            }
        }
        if(this.keyDown('d')) {
            if(this.player.x <= this.width-this.player.width) {
                this.player.moveX(this.playerSpeed);
            }
        }
        if(this.keyDown(' ') && this.frames % 10 === 0) {
            const bullet = new Rect(
                this.player.x + (this.player.width / 2),
                this.player.y,
                2,
                3
            ).setColor(new Color(0, 210, 30));
            this.bullets.add(bullet);
        }
        this.bullets.moveY(-5);
        this.enemies.moveX(0.4);
    },

    draw() {
        this.background = new Color(0);

        this.add(this.enemies);
        this.add(this.bullets);
        this.add(this.player);
    }
});