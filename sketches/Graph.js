const graph = new Canv('canvas', {
    width: 500,
    height: 500,
    field(label, number, color) {
        return { label, number, color: new Color(color), animating: 1 };
    },
    setup() {
        this.data = {
            label: "Number of People",
            inc: 5,
            fields: [
                this.field("Apple", 35, "red"),
                this.field("Orange", 30, "orange"),
                this.field("Banana", 10, "yellow"),
                this.field("Kiwifruit", 25, "green"),
                this.field("Blueberry", 40, "blue"),
                this.field("Grapes", 5, "purple")
            ]
        };

        
    },

    draw() {
        this.clear();
        const bounds = new Rect(0, 10, this.width, this.height-10);
        bounds.noFill();
        this.add(bounds);

        const len = this.data.fields.length;
        this.data.fields = this.data.fields.map((field, i) => {
            let g = 20;
            let w = (bounds.width / len) - g;
            let h;
            if(field.animating && field.animating < (field.number) * (bounds.height / 40)) {
                field.animating += this.data.inc;
                h = field.animating;
            } else {
                h = field.number * (bounds.height / 40);
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