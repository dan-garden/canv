new Canv('canvas', {
    setup() {
        this.displays = [];
        this.shows = [];

        cmd.registerFunction(() => {
            if(cmd.lines.length >= 1) {
                for(let i = 0; i < this.displays.length; i++) {
                    this.displays[i].pop();
                    this.displays[i].unshift(
                        eval(`(function() { return ${this.shows[i]} }.bind(cmd))()`)
                    );
                }
            }
        });

        cmd.registerCommand("monitor", args => {
            this.shows.push(args.join(" "));
            // console.log(this.shows);
            this.displays.push([]);
            // console.log(this.displays.length, this.shows.length);


            return this.displays[this.displays.length-1];
        });


        cmd.registerEvent("clear", () => {
            this.displays.forEach((display, i) => {
                cmd.log(display);
            })
        })
    }
})