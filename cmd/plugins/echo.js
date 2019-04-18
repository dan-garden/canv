new Canv('canvas', {
    fullscreen: true,
    setup() {
        cmd.registerCommand("echo", (params) => {
            // return params.join(" ")
        })
    },
})