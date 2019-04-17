new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.display = [];
        cmd.log(this.display, cmd.colors.green);
        cmd.newLine(cmd.prefix);
    },

    update() {
        this.display.pop();
        this.display.unshift("History Length: " + cmd.history.length);
    }
})