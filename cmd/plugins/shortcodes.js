new Canv('canvas', {
    setup() {
        cmd.registerCommand("load", args => {
            const type = args.shift();
            if(type === "sketch") {
                cmd.loadSketch(args.join(" "));
            } else if(type === "plugin") {
                cmd.loadPlugin(args.join(" "));
            }
        });

        cmd.registerCommand("plugins", args => {
            return Object.keys(cmd.plugins);
        });

        cmd.registerCommand("help", args => {
            return Object.keys(cmd.commands);
        });


        cmd.registerCommand("run", args => {
            cmd.run(args.join(" "));
        });

        cmd.registerFunction(() => {
            const colors = [
                "white",
                "blue",
                "yellow",
                "teal"
            ];
            const rand = Canv.random(0, 2);
            const color = colors[rand];
            cmd.view.add(
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


            cmd.view.moveX(moveX);
            cmd.view.moveY(moveY);

            
        });

    }
})