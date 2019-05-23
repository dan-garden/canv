new Canv('canvas', {
    setup() {
        this.src = false;
        this.bg = false;
        cmd.registerCommand("bg", args => {
            if(args[0]) {
                this.src = args.join(" ");
            }
        });

        cmd.registerFunction(() => {
            if(this.src) {
                this.bg = new Pic(this.src, 0, 0, cmd.width, cmd.height);
                this.src = false;
            }
            if(this.bg) {
                cmd.add(this.bg);
            }
        });
    }
})