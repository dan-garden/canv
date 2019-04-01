new Canv("canvas", {
    width: 400,
    height: 400,
    menu() {
        const linkObjects = [];
        const height = 50;
        const links = [
            { name: "Link 1", href: "#" },
            { name: "Link 2", href: "#" },
            { name: "Link 3", href: "#" },
            { name: "Link 4", href: "#" }
        ];

        for(let i = 0; i < links.length; i++) {
            const link = links[i];
            const bg = new Rect(
                i * (this.width / links.length),
                0,
                this.width / links.length,
                height
            );
            
            const text = new Text(
                link.name,
                bg.x + (bg.width/2),
                bg.y + (bg.height/2),
                14
            );
            text.color = new Color(255);
            text.textAlign = "center";

            if(bg.contains(this.mouseX, this.mouseY)) {
                bg.color = new Color(41, 147, 229);
                if(this.mouseDown) {
                    document.location = link.href;
                }
            } else {
                bg.color = new Color(27, 119, 189);
            }

            linkObjects.push(new ShapeGroup([bg, text]));
        }

        const menu = new ShapeGroup(linkObjects);
        if(menu.contains(this.mouseX, this.mouseY)) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }

        return menu;
    },
    draw() {
        this.add(this.menu());
    }
})