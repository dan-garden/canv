class Bee {
    constructor(size, price, generates, every) {
        this.owned = 0;
        this.size = size;
        this.price = price;
        this.generates = generates;
        this.every = every;
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
        this.price *= 1.8;
    }

    getShape(canv) {
        const shape = new Circle(canv.randomWidth, canv.randomHeight, this.size);
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

        this.honey = 20;
        this.flowerPower = 1;
        this.shop = {
            bees: {
                worker: new Bee(1, 20, 1, 200),
                honeybee: new Bee(2, 20, 2, 200),
                drone: new Bee(1, 20, 2, 100),

            }
        }
    },

    addHoney(n=1) {
        this.honey += n;
    },

    buy(type, name) {
        const item = this.shop[type][name];
        const buy = item.buy(this.honey);

        if(buy!==false) {
            this.honey = buy;
            this.view.bees.add(item.getShape(this));
        } else {
            console.log("not enough honey");
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
        // console.log(owned);
    },

    draw() {
        this.add(this.view);
    }
})