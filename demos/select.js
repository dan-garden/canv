const app = new Canv('canvas', {
    setup() {
        this.selection = false;
        this.color = Color.random();
        this.rects = new ShapeGroup();

        for(let i = 0; i < 20; i++) {
            const rect = new Rect(
                Canv.random(0, this.width),
                Canv.random(0, this.height),
                Canv.random(5, 50),
                Canv.random(5, 50)
            ).setColor(255);
            this.rects.add(rect);
        }
    },

    updateSelection() {
        if(this.mouseDown) {
            if(!this.firstPoint) {
                this.firstPoint = new Vector(this.mouseX, this.mouseY);
            }

            if(this.firstPoint) {
                let startPoint = this.firstPoint;
                let endPoint = new Vector(this.mouseX, this.mouseY);

                let selectX = startPoint.x;
                let selectY = startPoint.y;
                let selectW = endPoint.x - startPoint.x;
                let selectH = endPoint.y - startPoint.y;

                if(selectW < 0) {
                    selectX = endPoint.x;
                    selectW = startPoint.x - endPoint.x;
                }

                if(selectH < 0) {
                    selectY = endPoint.y;
                    selectH = startPoint.y - endPoint.y;
                }

                this.selection = new Rect(
                    selectX,
                    selectY,
                    selectW,
                    selectH
                );

                this.selection.setColor(new Color(this.color).opacity(0.2))
                .setStroke(this.color, 1);
            }
        } else {
            if(this.selection) {
                this.selection.shown = false;
                this.firstPoint = false;
            }
        }
    },

    addSelection() {
        if(this.selection) {
            this.add(this.selection);
        }
    },

    update() {
        this.updateSelection();

        if(this.selection) {
            this.rects.forEach(rect => {
                if(rect.intersects(this.selection)) {
                    rect.color = Color.green;
                } else {
                    rect.color = Color.white;
                }
            })
        }
    },

    draw() { 
        this.clear();
        // this.add(this.rects);
        this.addSelection();
    }
})