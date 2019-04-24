new Canv('canvas', {
    setup() {
        this.buttons = new ShapeGroup({ increase: new Rect, decrease: new Rect });
        this.clicked = false;

        this.color = cmd.colors.grey;
        this.hoverColor = cmd.colors.grey.shade(10);

        cmd.view.add(this.buttons);
    },

    update() {
        this.buttons.setColor(cmd.colors.grey);

        this.buttons.increase.setPos(this.width - 40, 50);
        this.buttons.increase.setDimensions(30, 30);

        this.buttons.decrease.setPos(this.width - 80, 50);
        this.buttons.decrease.setDimensions(30, 30);


        if(this.buttons.increase.contains(this.mouseX, this.mouseY)) {
            if(this.mouseDown && !this.clicked) {
                this.increase();
                this.clicked = true;
                setTimeout(() => { this.clicked=false; }, 100)
            }
            this.buttons.increase.color = this.hoverColor;
        } else {
            this.buttons.increase.color = this.color;
        }
        
        if(this.buttons.decrease.contains(this.mouseX, this.mouseY)) {
            if(this.mouseDown && !this.clicked) {
                this.clicked = true;
                this.decrease();
                setTimeout(() => { this.clicked=false; }, 100)
            }
            this.buttons.decrease.color = this.hoverColor;
        } else {
            this.buttons.decrease.color = this.color;
        }
    },

    increase() {
        cmd.fontSize++;
        cmd.lineHeight++;
    },

    decrease() {
        cmd.fontSize--;
        cmd.lineHeight--;
    },
})