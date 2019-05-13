const game = new Canv('canvas', {
    setup() {
        const carW = 100;
        const carH = 75;
        this.car = new Pic("images/car.jpg", this.halfWidth(carW), this.halfHeight(carH), carW, carH, () => {
            this.car.rotate(-90);
            this.add(this.car);
            
        }); 
    },

    update() {
        if(this.car.loaded) {
            this.filterPixels((color, x, y) => {
                if(
                    color.r > 13 && color.r < 49 &&
                    color.g > 13 && color.g < 254 &&
                    color.b > 13 && color.b < 120
                    // && !(color.g === color.b && color.r === color.g && color.b === color.r)
                ) {
                    return color;
                } else {
                    const random = Color.random();
                    random.a = color.a;
                    return new Color(255, 0, 0, 255);
                }
            });
        }
    }

})