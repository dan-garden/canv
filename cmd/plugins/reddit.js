new Canv('canvas', {
    setup() {
        cmd.registerCommand("r", args => {
            const sub = args.shift();
            if(sub) {
                fetch(`https://www.reddit.com/r/${sub}.json`)
                .then(result => result.json())
                .then(result => {
                    if(result.data && result.data.children) {
                        result.data.children.forEach(post => {
                            cmd.log(
                                post.data.title,
                                false,
                                "https://reddit.com"+post.data.permalink
                            );
                        })
                    }
                    cmd.newLine();
                })
            }
        })
    }
})