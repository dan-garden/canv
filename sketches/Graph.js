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
        this.clear();
        const bounds = new Rect(0, 10, this.width, this.height-10);

        bounds.noFill();
        this.add(bounds);

        const highest = Math.max(...this.data.fields.map(f => f.number));
        const len = this.data.fields.length;
        this.data.fields = this.data.fields.map((field, i) => {
            let g = 20;
            let w = (bounds.width / len) - g;
            let h;
            if(field.animating && field.animating < (field.number) * (bounds.height / highest)) {
                field.animating += this.data.inc;
                h = field.animating;
            } else {
                h = field.number * (bounds.height / highest);
            }
            let x = (g / 4) + bounds.x + (i * (w + g));
            let y = (bounds.height + bounds.y) - h;
            let c = field.color;
            const s = 10;
            const bar = new ShapeGroup({
                shadow: new Rect(x+s, y-s, w, h+s).setColor(c.shade(-100)),
                bar: new Rect(x, y, w, h).setColor(c)
            });

            if(bar.contains(this.mouseX, this.mouseY)) {
                bar.bar.setColor(c.shade(20));
            } else {
                bar.bar.setColor(c.shade(0));
            }
            this.add(bar);
            return field;
        });
    }
})