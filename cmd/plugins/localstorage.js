new Canv('canvas', {
    setup() {
        cmd.registerCommand("local", args => {
            const act = args.shift();
            if(act === "get") {
                return localStorage.getItem(args.shift());
            } else if(act === "set") {
                return localStorage.setItem(args.shift(), args.join(" "))
            } else if(act === "remove" || act === "del") {
                return localStorage.removeItem(args.join(" "))
            } else {
                return Object.keys(localStorage);
            }
        });
    }
})