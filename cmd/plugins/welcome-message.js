new Canv('canvas', {
    setup() {
        const greeting = `Welcome to Dan's Terminal`;
        greeting.split("\n").forEach(line => cmd.newLine(line));

        cmd.registerFunction((canv) => {
            if(canv.frames % 10 === 0) {
                cmd.lines = cmd.lines.map(line => {
                    if(line.text === greeting) {
                        line.color = Color.random();
                    }

                    return line;
                })
            }
        });
    }
})