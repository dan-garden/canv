new Canv('canvas', {
    show: 0,
    indent: 30,
    setup() {
        cmd.registerCommand("ln", () => this.toggle());

        cmd.registerFunction(() => {
            if (this.show) {
                const lineNumbers = new ShapeGroup([]);
                const numbersBG = new Rect(
                    0, 0,
                    this.indent, this.height
                );
                numbersBG.color = new Color(
                    cmd.colors.secondary
                ).shade(30);
                lineNumbers.add(numbersBG);

                for (let i = 0; i < cmd.lines.length; i++) {
                    const lineNumber = new Text(
                        i + 1,
                        numbersBG.width-5,
                        (i * cmd.lineHeight),
                        cmd.fontSize
                    );

                    lineNumber.color = new Color(cmd.colors.primary).shade(255);
                    lineNumber.textAlign = "right";
                    lineNumber.fontFamily = cmd.fontFamily;

                    lineNumbers.add(lineNumber);
                }

                cmd.view.shapes[0] = lineNumbers;
            } else {
                delete cmd.view.shapes[0];
            }
        });



        this.toggle();
    },


    toggle() {
        this.show = !this.show;
        cmd.textIndent = this.show?(this.indent+5):0;
    }

})