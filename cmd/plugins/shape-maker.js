new Canv('canvas', {
    setup() {
        cmd.registerCommand("c-new", args => {
            if(args.length > 0) {
                let type = args.shift().toLowerCase();
                type = type.charAt(0).toUpperCase() + type.slice(1);
                const shapeClass = eval(type);
                const shape = new shapeClass(...args);
                shape.setColor(255);
                const shapeIndex = cmd.view.shapes.length;
                cmd.view.add(shape);
                
                return shapeIndex;
            }
        });



        cmd.registerCommand("c-act", args => {
            if(args.length > 0) {
                const shapeIndex = args.shift();
                const shape = cmd.view.shapes[shapeIndex];

                const fn = eval(args.join(" "));
                if(typeof fn === "function") {
                    fn(shape);
                }
            }
        })
    }
})