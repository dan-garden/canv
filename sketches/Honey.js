class Bee {
    constructor(size, price, generates, every) {
        this.owned = 0;
        this.size = size;
        this.price = price;
        this.generates = generates;
        this.every = every;
    }

    calculateGenerated() {
        return this.generates * this.owned;
    }

    buy(honey) {
        if(honey >= this.price) {
            const newHoney = honey -= this.price;

            this.owned++;
            this.increasePrice();
            return newHoney;
        } else {
            return false;
        }
    }

    increasePrice() {
        // this.price *= 1.2;
        // this.price = Math.floor(this.price);
    }

    getShape(canv) {
        const shape = new Circle(
            Canv.random(canv.halfWidth() - 50, canv.halfWidth() + 50),
            Canv.random(canv.halfHeight() - 50, canv.halfHeight() + 50),
            this.size,
        );
        return shape;
    }
}

const bc = new Canv('canvas', {
    width: 500,
    height: 500,
    setup() {
        this.flower = new ShapeGroup({
            bulb: new Circle(this.halfWidth(), this.halfHeight(), 15)
                .setColor(new Color(63, 28, 0)),
            petals: new ShapeGroup([
                new Circle(this.halfWidth()-13, this.halfHeight()-13, 10).setStroke(0),
                new Circle(this.halfWidth()+13, this.halfHeight()-13, 10).setStroke(0),
                new Circle(this.halfWidth()-13, this.halfHeight()+13, 10).setStroke(0),
                new Circle(this.halfWidth()+13, this.halfHeight()+13, 10).setStroke(0),
                new Circle(this.halfWidth()-13, this.halfHeight(), 15).setStroke(0),
                new Circle(this.halfWidth()+13, this.halfHeight(), 15).setStroke(0),
                new Circle(this.halfWidth(), this.halfHeight()+13, 15).setStroke(0),
                new Circle(this.halfWidth(), this.halfHeight()-13, 15).setStroke(0)
            ]).setColor(new Color(255, 255, 0)),
            stem: new Rect(this.halfWidth(5), this.halfHeight(), 5, 100)
                .setColor(new Color(0, 103, 28)),
        });

        this.flower.bulb.addEventListener("click", () => {
            this.addHoney(this.flowerPower)
        })

        

        this.view = new ShapeGroup({
            honeyCount: new Text("", this.halfWidth(), 15)
                .setAlign("center"),
            bees: new ShapeGroup(),
            flower: this.flower,
            background: new Rect(0, 0, this.width, this.height)
                .setColor(new Color(255)),
        });

        this.honey = 200000;
        this.flowerPower = 1;
        this.shop = {
            bees: {
                worker: new Bee(1, 20, 1, 10),
                honeybee: new Bee(1, 100, 2, 10),
                drone: new Bee(2, 200, 2, 5),

            }
        }
    },

    addHoney(n=1) {
        this.honey += n;
    },

    buy(type, name, amount=1) {
        const item = this.shop[type][name];
        for(let i = 0; i < amount; i++) {
            const buy = item.buy(this.honey);

            if(buy!==false) {
                this.honey = buy;
                this.view.bees.add(item.getShape(this));
            } else {
                console.log("not enough honey");
            }
        }
    },

    getOwned() {
        const owned = [];
        Object.values(this.shop).forEach(shopType => {
            Object.values(shopType).forEach(shopItem => {
                if(shopItem.owned > 0) {
                    owned.push(shopItem);
                }
            })
        });
        return owned;
    },

    update() {
        this.view.honeyCount.string = this.honey;

        const owned = this.getOwned();
        owned.forEach(item => {
            if(this.frames % item.every === 0) {
                this.addHoney(item.calculateGenerated());
            }
        });

        this.view.bees.forEach(bee => {
            bee.moveX(Canv.random(-1, 1));
            bee.moveY(Canv.random(-1, 1));
            if(bee.x < this.halfWidth()-50) {
                bee.x = this.halfWidth()-50;
            }
            if(bee.x > this.halfWidth()+50) {
                bee.x = this.halfWidth()+50;
            }
            if(bee.y < this.halfHeight()-50) {
                bee.y = this.halfHeight()-50;
            }
            if(bee.y > this.halfHeight()+50) {
                bee.y = this.halfHeight()+50;
            }
        })
    },

    draw() {
        this.add(this.view);
    }
})