const graph = new Canv('canvas', {
    width: 500,
    height: 500,
    setup() {
        this.graph = new BarGraph({
            bounds: new Rect(100, 100, this.width-200, this.height-200),
            label: "Number of People",
            inc: 50,
            max: 400,
            gap: 10,
            shadow: 1,
            fields: [
                {label: "Apple", number: 70, color: new Color("red")},
                {label: "Orange", number: 60, color: new Color("orange")},
                {label: "Banana", number: 50, color: new Color("yellow")},
                {label: "Kiwifruit", number: 40, color: new Color("green")},
                {label: "Blueberry", number: 30, color: new Color("blue")},
                {label: "Grapes", number: 20, color: new Color("indigo")},
                {label: "Watermelon", number: 10, color: new Color("violet")}
            ]
        });        
    },


    update() {
        this.graph.bars.shapes.forEach((bar, i) => {
            const orig = this.graph.fields[i].color;
            if(bar.contains(this.mouseX, this.mouseY)) {
                bar.color = orig.shade(-100);
                if(this.mouseDown) this.graph.fields[i].number++;
            } else {
                bar.color = orig;
            }
        });
    },

    draw() {
        this.clear();
        this.graph.update();
        this.add(this.graph);
    }
})