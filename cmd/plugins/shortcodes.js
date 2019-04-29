new Canv('canvas', {
    setup() {
        cmd.registerCommand("clear", args => {
            cmd.lines = [];
            cmd.triggerEvent("clear");
        });

        cmd.registerCommand("cls", args => {
            cmd.lines = [];
            cmd.triggerEvent("clear");
        });

        cmd.registerCommand("echo", args => {
            return args.join(" ");
        })


        cmd.registerCommand("load", args => {
            const type = args.shift();
            if(type === "sketch") {
                cmd.loadSketch(args.join(" "));
                return true;
            } else if(type === "plugin") {
                cmd.loadPlugin(args.join(" "));
                return true;
            }
            return false; 
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

        cmd.registerCommand("log", args => {
            cmd.log(eval(args.join(" ")));
        });


        // cmd.registerEvent("newline", args => {
        //     if(cmd.lines.length === Math.floor(cmd.height / cmd.lineHeight)) {
        //         cmd.run("clear");
        //     }
        // })

    }
})