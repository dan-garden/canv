const c = new Painter("#painter", {
    width: 500,
    height: 500,
    draw() {
        if(this.mouseDown) {
            let p = new Line(this.mousePrevX, this.mousePrevY, this.mouseX, this.mouseY);
            p.width = 1;
            this.add(p);
        }
    }
})