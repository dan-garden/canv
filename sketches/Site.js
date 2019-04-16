const app = new Canv("canvas", {
    fullscreen: true,
    text: "",
    selected: false,
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
    textbox() {
        const textbox = new ShapeGroup({
            box: new Rect(
                this.halfWidth(100),
                this.halfHeight(30),
                100,
                30
            ),
            text: new Text(
                this.text,
                this.halfWidth(100) + 10,
                this.halfHeight(30) + 20
            )
        });

        const contains = textbox.contains(this.mouseX, this.mouseY);
        if(this.mouseDown && contains && !this.selected) {
            this.selected = true;
        } else if (this.mouseDown && !contains && this.selected){
            this.selected = false;
        }

        textbox.box.showStroke = true;
        textbox.box.noFill();

        if(this.selected) {
            textbox.box.stroke = new Color(0, 0, 255);
        } else {
            textbox.box.stroke = new Color(0);
        }

        if(this.selected && contains) {
            document.body.style.cursor = "text";
        } else if(!this.selected && contains) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }

        return textbox;
    },

    setup() {
        window.addEventListener("keydown", e => {
            if(this.selected) {
                if(e.key === "Backspace" || e.key === "Delete") {
                    e.preventDefault();
                    this.text = this.text.substring(0, this.text.length - 1);
                } else if(e.key.length===1) {
                    this.text += e.key;
                }
            }
        })
    },

    draw() {
        // this.clear();
        this.add(this.textbox());
        this.add(this.menu());
    }
})