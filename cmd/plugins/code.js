new Canv('canvas', {
    fullscreen: true,
    setup() {
        cmd.registerCommand("code", (params) => {
            document.location = "vscode://"+params.join(" ");
        });
    }
})