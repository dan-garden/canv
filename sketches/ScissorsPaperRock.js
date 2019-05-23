const game = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.types = [
            {
                name: "scissors",
                sprite: new Pic("images/scissors.png"),
                beats: ["paper"]
            },
            {
                name: "paper",
                sprite: new Pic("images/paper.png"),
                beats: ["rock"]
            },
            {
                name: "rock",
                sprite: new Pic("images/rock.png"),
                beats: ["scissors"]
            },
            // {
            //     name: "car",
            //     sprite: new Pic("images/car.jpg"),
            //     beats: ["scissors", "paper", "rock"]
            // }
        ];

        this.streak = 0;
        this.reset();
    },


    reset() {
        this.playerType = false;
        this.botType = false;
        this.botChosen = false;
        this.gameOver = false;
        this.winner = false;
    },


    determinWinner() {
        if(!this.gameOver) {
            this.gameOver = true;
            if(this.types[this.playerType].beats.includes(this.types[this.botType].name)) {
                this.winner = "player";
                this.streak++;
            } else if(this.types[this.botType].beats.includes(this.types[this.playerType].name)) {
                this.winner = "bot";
                this.streak = 0;
            } else {
                this.winner = "tie";
            }

            setTimeout(() => {
                this.reset();
            }, 1);
        }
    },

    update() {
        if(this.playerType!==false && !this.botChosen) {
            if(this.botType!==false) {
                setTimeout(() => {
                    this.botChosen = true;
                    this.determinWinner();
                }, 0)
            }
            this.botType = Canv.random(0, this.types.length-1);

            
        }
    },
    
    draw() {
        this.clear();
        this.types.forEach((type, i) => {
            const w = this.width / this.types.length;
            const h = 100;
            const x = w * i;
            const y = 0;

            type.sprite.width = w / 2;
            type.sprite.height = h;
            type.sprite.x = x + (type.sprite.width / 2);
            type.sprite.y = y;

            const box = new ShapeGroup({
                bounds: new Rect(x, y, w, h).setColor(255).setStroke(0),
                display: type.sprite
            });

            if(box.contains(this.mouseX, this.mouseY) || this.playerType===i) {
                box.bounds.color = new Color(200);
                if(this.mouseDown && this.playerType===false) {
                    this.playerType = i;
                }
            } else {
                box.bounds.color = new Color(255);
            }

            this.add(box);
        });

        if(this.playerType!==false) {
            const player = this.types[this.playerType];
            player.sprite.width = 200;
            player.sprite.height = 200;
            player.sprite.x = 0;
            player.sprite.y = this.halfHeight(player.sprite.height);
            this.add(player.sprite);
        }

        if(this.botType!==false) {
            const bot = this.types[this.botType];
            bot.sprite.width = 200;
            bot.sprite.height = 200;
            bot.sprite.x = this.width-bot.sprite.width;
            bot.sprite.y = this.halfHeight(bot.sprite.height);
            this.add(bot.sprite);
        }

        if(this.winner) {
            const winBox = new Rect(this.halfWidth(100), this.halfHeight(100), 100, 100);
            if(this.winner === "bot") {
                winBox.color = new Color(255, 0, 0);
            } else if(this.winner === "player") {
                winBox.color = new Color(0, 255, 0);
            } else if(this.winner === "tie") {
                winBox.color = new Color(150, 150, 150);
            }
            this.add(winBox);
        }

        const streak = new Text(this.streak, this.halfWidth(), this.halfHeight());
        streak.textAlign = "center";
        streak.fontSize = 30;

        this.add(streak);
    }
});