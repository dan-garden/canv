class Term extends Canv {
    constructor() {
        super('canvas', {
            fullscreen: true,
            plugins: ["history-counter", "size-changer"],
            colors: {
                primary: new Color(255),
                secondary: new Color(18, 0, 36),

                grey: new Color(150),

                magenta: new Color(213, 31, 222),

                red: new Color(255, 100, 100),
                green: new Color(100, 255, 100),
                blue: new Color(100, 100, 255)
            },
            setup() {
                this.prefix = "> "

                this.lines = [];
                this.history = localStorage["cli-history"] ?
                    JSON.parse(localStorage.getItem("cli-history")) : [];

                this.curHistoryIndex = this.history.length;

                this.fns = [];
                this.view = new ShapeGroup;

                this.maxHistory = 100000;
                this.lineHeight = 14;
                this.fontSize = 12;
                this.cursor = new Rect(0, 0, 5, this.lineHeight - 2).setColor(this.colors.primary);
                
                this.bindPaste();
                this.bindKeyDown();

                this.loadPlugins();
            },

            bindPaste() {
                window.addEventListener("paste", e => {
                    e.preventDefault();
                    this.lines[this.lines.length - 1].text += e.clipboardData.getData("text");
                });
            },

            bindKeyDown() {
                window.addEventListener("keydown", e => {
                    if (e.ctrlKey && e.key === "v") return;
                    const lastLineIndex = this.lines.length - 1;
                    const lastLine = this.lines[lastLineIndex].text;
                    if (e.key === "ArrowUp") {
                        this.historyChange(-1);
                    } else if (e.key === "ArrowDown") {
                        this.historyChange(1);
                    } else if (e.key === "Enter") {
                        e.preventDefault();
                        const command = lastLine.replace(this.prefix, "");
                        const line = this.generateLine(command);
                        this.updateHistory(command);
                        this.newLine(line);
                        this.newLine({text: this.prefix})
                    } else if (e.key === "Backspace" || e.key === "Delete") {
                        e.preventDefault();
                        if (lastLine !== this.prefix) {
                            this.lines[lastLineIndex].text = lastLine.substring(0, lastLine.length - 1);
                        }
                    } else if (e.key.length === 1) {
                        let maxWidth = (this.width / this.charWidth) - 1;
                        if (this.lines[lastLineIndex].text.length >= maxWidth) {
                            this.lines.push({
                                text: "",
                                color: this.colors.primary
                            });
                            this.lines[lastLineIndex + 1].text += e.key;
                        } else {
                            this.lines[lastLineIndex].text += e.key;
                        }
                    }
                });
            },


            loadPlugins() {
                this.plugins.forEach(plugin => {
                    this.loadPlugin(plugin);
                });
                this.newLine({text: this.prefix})
            },

            newLine(line) {
                if (typeof line !== "object") {
                    line = {
                        text: line,
                        color: this.colors.primary
                    };
                }
                this.lines.push(line);
            },

            log(result, color=this.colors.primary) {
                const line = this.filterResult(result, color);
                this.newLine(line);
            },


            filterResult(text, color) {
                if (typeof text === "number") {
                    color = this.colors.magenta;
                } else if (typeof text === "boolean") {
                    if (text === true) {
                        color = this.colors.green;
                    } else if (text === false) {
                        color = this.colors.red;
                    }
                } else if (typeof text === "string") {
                    text = '"' + text + '"';
                    color = this.colors.green;
                } else if (typeof text === "object" && !(text instanceof Error)) {
                    color = this.colors.blue;
                    // text = JSON.stringify(text, null, 2);
                    // text.split("\n").forEach(line => {
                    //     this.lines.push({text: line, color}); 
                    // })

                    // this.lines.push({text: this.prefix})
                    // return;
                } else if (typeof text === "undefined") {
                    color = this.colors.grey;
                }

                
                return { text, color };
            },

            generateLine(command) {
                let line = {
                    text: "",
                    color: new Color(this.colors.primary),
                };

                try {
                    if (command.startsWith('clear()')) {
                        line.text = this.clear();
                    } else {
                        ["const", "var", "let"].forEach(prefix => {
                            if (command.startsWith(prefix)) {
                                let setter = command.replace(prefix, "").trim();
                                eval("window." + setter);
                            }
                        });
                        line.text = eval(command);
                    }
                    line = this.filterResult(line.text, line.color);
                } catch (err) {
                    line.text = err;
                    line.color = this.colors.red;
                }

                return line;
            },

            updateHistory(command) {
                this.history.push(command);

                if (this.history.length >= this.maxHistory) {
                    this.history = this.history.slice(Math.max(this.history.length - this.maxHistory, 0))
                }

                this.curHistoryIndex = this.history.length;

                localStorage.setItem("cli-history", JSON.stringify(this.history));
            },

            historyChange(n) {
                if (n === -1) {
                    if (this.curHistoryIndex === 0) {
                        this.curHistoryIndex = this.history.length - 1;
                    } else {
                        this.curHistoryIndex--;
                    }
                } else if (n === 1) {
                    if (this.curHistoryIndex === this.history.length - 1) {
                        this.curHistoryIndex = 0;
                    } else {
                        this.curHistoryIndex++;
                    }
                }
                this.lines[this.lines.length - 1].text = this.prefix + this.history[this.curHistoryIndex];
            },

            loadPlugin(name) {
                let file = "plugins/" + name + ".js";
                fetch(file+"?d="+new Date().getTime())
                    .then(result => result.text())
                    .then(result => {
                        this.plugins[this.plugins.indexOf(name)] = eval(`${result}`)
                    });
                return this.log(file + " loaded!");
            },

            clear() {
                this.lines = [];
                return "Console was cleared";
            },

            update(frame) {
                this.cursor.color = this.colors.primary;
                this.fns.forEach(fn => {
                    if (typeof fn === "function") {
                        fn(this);
                    }
                })
            },

            createFunction(fn) {
                this.fns.push(fn.bind(this));
                return fn.toString();
            },

            draw() {
                this.background = this.colors.secondary;

                let lastLineWidth = 0;
                this.lines.forEach((line, i) => {
                    const text = new Text(line.text, 0, i * this.lineHeight);
                    text.color = line.color || this.colors.primary;
                    text.fontFamily = "Lucida Console";
                    text.fontSize = this.fontSize;
                    this.add(text);

                    if (i === this.lines.length - 1) {
                        lastLineWidth = text.width;
                        this.charWidth = lastLineWidth / text.string.length;
                    }
                });

                this.cursor.x = lastLineWidth;
                this.cursor.y = ((this.lines.length - 1) * this.lineHeight) + 2;
                this.cursor.height = this.fontSize;

                this.add(this.cursor);
                this.add(this.view);
            }
        });


    }
}


const cmd = new Term();