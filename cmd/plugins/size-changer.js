new Canv('canvas', {
    setup() {
        this.buttons = new ShapeGroup({ increase: new Rect, decrease: new Rect });

        this.buttons.increase.addEventListener("click", () => this.increase());
        this.buttons.increase.addEventListener("mouseover", () => {this.buttons.increase.color = this.hoverColor});
        this.buttons.increase.addEventListener("mouseout", () => {this.buttons.increase.color = this.color});

        this.buttons.decrease.addEventListener("click", () => this.decrease());
        this.buttons.decrease.addEventListener("mouseover", () => {this.buttons.decrease.color = this.hoverColor});
        this.buttons.decrease.addEventListener("mouseout", () => {this.buttons.decrease.color = this.color});

        this.color = cmd.colors.grey;
        this.hoverColor = new Color(cmd.colors.grey).shade(10);

        cmd.view.add(this.buttons);
    },

    update() {

        this.buttons.increase.setPos(this.width - 40, 50);
        this.buttons.increase.setDimensions(30, 30);

        this.buttons.decrease.setPos(this.width - 80, 50);
        this.buttons.decrease.setDimensions(30, 30);
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