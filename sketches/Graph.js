new Canv('canvas', {
    gWidth: 300,
    gHeight: 300,
    setup() {
        this.graph = new BarGraph({
            bounds: new Rect(
                this.halfWidth(this.gWidth),
                this.halfHeight(this.gHeight),
                this.gWidth,
                this.gHeight
            ),
            label: "Number of People",
            step: 10,
            gap: 0,
            fields: [
                {label: "Apple", number: 70, color: Color.random()},
                {label: "Orange", number: 60, color: Color.random()},
                {label: "Banana", number: 50, color: Color.random()},
                {label: "Kiwifruit", number: 40, color: Color.random()},
                {label: "Blueberry", number: 30, color: Color.random()},
                {label: "Grapes", number: 20, color: Color.random()},
                {label: "Watermelon", number: 10, color: Color.random()}
            ]
        });
    },
    draw() {
        this.add(this.graph);
    }
})