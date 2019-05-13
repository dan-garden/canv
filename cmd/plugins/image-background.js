new Canv('canvas', {
    setup() {
        cmd.registerCommand("bg", args => {
            cmd.bg = false;
            if(args[0]) {
                this.src = args.join(" ");
            }
        });

        cmd.registerFunction(() => {
            if(!cmd.bg) {
                cmd.add(new Pic(this.src, 0, 0, cmd.width, cmd.height))
            }
        });
    }
})