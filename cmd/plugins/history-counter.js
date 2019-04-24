new Canv('canvas', {
    setup() {
        this.display = [];
        cmd.log(this.display, cmd.colors.green);
        cmd.newLine(cmd.prefix);

        cmd.registerFunction(() => {
            this.display.pop();
            this.display.unshift("History Length: " + cmd.history.length);
        });
    }
})