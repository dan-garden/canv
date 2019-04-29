new Canv('canvas', {
    setup() {
        this.stars = new ShapeGroup();
        cmd.view.add(this.stars);
        cmd.registerFunction(() => {
            const colors = [
                "white",
                "blue",
                "yellow",
                "teal"
            ];
            const rand = Canv.random(0, 2);
            const color = colors[rand];
            this.stars.add(
                new Circle(
                    Canv.random(cmd.width),
                    Canv.random(cmd.height),
                    Canv.random(2)
                ).setColor(color)
            );

            const moveX = this.mouseX<this.width/2?
            (-(this.mouseX - (this.width/2)) * 0.03):
            -((this.mouseX - (this.width/2)) * 0.03)

            const moveY = this.mouseY<this.height/2?
            (-(this.mouseY - (this.height/2)) * 0.03):
            -((this.mouseY - (this.height/2)) * 0.03)


            this.stars.moveX(moveX);
            this.stars.moveY(moveY); 
        });
    }
})