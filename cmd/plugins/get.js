new Canv('canvas', {
    setup() {
        cmd.registerCommand("get", params => {
            let type = "text";
            if(params.indexOf("json") > -1) {
                type = params.splice(params.indexOf("json"), 1)[0];
            }

            if(params[0]) {
                fetch(params[0])
                .then(result => type === "json" ? result.json() : result.text())
                .then(result => {
                    cmd.log(result);
                    cmd.newLine();
                });
                return "Fetching data";
            } else {
                return new Error("Invalid URL");
            }
        })
    }
})