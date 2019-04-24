new Canv('canvas', {
    setup() {
        cmd.registerCommand("code", (params) => {
            document.location = "vscode://"+params.join(" ");
        });
    }
})