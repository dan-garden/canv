new Canv('canvas', {
    setup() {
        cmd.registerCommand("invert", args => {
            Object.keys(cmd.colors).forEach(color => {
                cmd.colors[color] = cmd.colors[color].invert();
            });
        })
    }
});