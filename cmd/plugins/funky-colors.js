new Canv('canvas', {
    fullscreen: true,
    setup() {
        cmd.colors = {
            primary: new Color(0),
            secondary: new Color(255),

            grey: new Color(150),

            magenta: new Color(213, 31, 222),

            red: new Color(255, 100, 100),
            green: new Color(0, 100, 0),
            blue: new Color(100, 100, 255)
        }
    },
})