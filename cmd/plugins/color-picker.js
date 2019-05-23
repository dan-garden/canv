new Canv('canvas', {
    setup() {
        const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet", "black", "white"];

        cmd.registerCommand("colors", args => {
            const type = args.shift();
            if (!type) {
                throw new Error("Please enter a type");
            }

            colors.forEach(color => {
                const line = cmd.newLine(color, color, () => {
                    cmd.colors[type] = new Color(color);
                });

                if (type === "secondary") {
                    line.background = new Color(color);
                    line.color = new Color(255);
                } else {
                    line.color = new Color(color);
                }
            })
        })
    }
})