new Canv('canvas', {
    fullscreen: true,
    button(x, content, action) {
        let btn;
        if(content instanceof Circle) {
            content.x = x + 20;
            content.y = 15;
    
            btn = new ShapeGroup({
                bg: new Rect(x, 5, 40, 20),
                content
            });
        } else if(content instanceof Rect) {
            content.x = x + 5;
            content.y = 10;
    
            btn = new ShapeGroup({
                bg: new Rect(x, 5, 30, 20),
                content
            });
        }


        if(btn.contains(this.mouseX, this.mouseY)) {
            if(this.mouseDown) {
                action();
            }
            btn.bg.color = new Color(180);
        } else {
            btn.bg.color = new Color(150);
        }
        

        return btn;
    },
    setup() {
        this.size = 2;
        this.color = new Color(0);
    },

    update() {
        this.menu = new ShapeGroup();

        this.menu.add(new Rect(0, 0, this.width, 30).setColor(200));
        
        [1, 2, 5, 10].forEach((size, i) => {
            let btn = this.button(
                30 + (45 * i),
                new Circle(null, null, size),
                () => this.size=size
            );

            this.menu.add(btn);
        });

        [
            '#e6194b',
            '#3cb44b',
            '#ffe119',
            '#4363d8',
            '#f58231',
            '#911eb4',
            '#46f0f0',
            '#f032e6',
            '#bcf60c',
            '#fabebe',
            '#008080',
            '#e6beff',
            '#9a6324',
            '#fffac8',
            '#800000',
            '#aaffc3',
            '#808000',
            '#ffd8b1',
            '#000075',
            '#808080',
            '#ffffff',
            '#000000'
        ].forEach((color, i) => {
            let btn = this.button(
                220 + (35 * i),
                new Rect(null, null, 20, 10).setColor(color),
                () => this.color=color
            );

            this.menu.add(btn);
        });




        
    },

    draw() {
        this.add(this.menu);


        if(this.mouseDown) {
            const line = new Line(this.mousePrevX, this.mousePrevY, this.mouseX, this.mouseY);
            line.color = this.color;
            line.width = this.size;
            
            this.add(line);
        }
    
    }
});