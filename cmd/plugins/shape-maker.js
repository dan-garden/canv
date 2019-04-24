new Canv('canvas', {
    setup() {
        cmd.registerCommand("sm", args => {
            let type = args.shift().toLowerCase();
            type = type.charAt(0).toUpperCase() + type.slice(1);
            const shapeClass = eval(type);
            const shape = new shapeClass(...args);
            shape.setColor(255);
            const shapeIndex = cmd.view.shapes.length;
            cmd.view.add(shape);
            
            return shapeIndex;
        });
    }
})