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


    }
})