class Term extends Canv {
    constructor() {
        super('canvas', {
            colors: {
                primary: new Color(255, 255, 0),
                secondary: new Color(18, 0, 36),

                grey: new Color(150),

                magenta: new Color(213, 31, 222),
                orange: new Color(255, 140, 0),
                yellow: new Color(255, 255, 0),
                red: new Color(255, 100, 100),
                green: new Color(100, 255, 100),
                blue: new Color(100, 100, 255),

                link: new Color(255, 140, 0)
            },
            line: class {
                constructor(text, color, bg, link=false) {
                    this.text = text;
                    this.color = color;
                    if (bg) {
                        this.background = bg;
                    }
                    if(link) {
                        this.link = link;
                    }
                }
            },
            setup() {
                this.prefix = "$ ";
                this.lines = [];
                this.functions = [];
                this.overlays = [];
                this.commands = {};
                this.events = {};
                this.history = localStorage["cli-history"] ?
                    JSON.parse(localStorage.getItem("cli-history")) : [];

                this.curHistoryIndex = this.history.length;

                this.view = new ShapeGroup;

                this.maxHistory = 100;
                this.lineHeight = 14;
                this.fontFamily = "monospace";
                this.fontSize = 14;
                this.textIndent = 0;

                this.cursorPos = false;
                this.cursor = new Rect(0, 0, 1, this.lineHeight - 2).setColor(this.colors.primary);

                this.bindPaste();
                this.bindKeyDown();

                this.loadPlugins();
            },

            visible() {
                return this.overlays.length === 0;
            },

            clearHistory() {
                this.history = [];
                localStorage["cli-history"] = [];
            },

            bindPaste() {
                window.addEventListener("paste", e => {
                    if (this.visible()) {
                        e.preventDefault();
                        const pasteData = e.clipboardData.getData("text");
                        if (this.cursorPos === false) {
                            this.lines[this.lines.length - 1].text += pasteData;
                        } else {
                            const lastLine = this.lines[this.lines.length - 1].text;
                            const newLine = lastLine.substring(0, this.cursorPos) +
                                pasteData +
                                lastLine.substring(this.cursorPos, lastLine.length);

                            this.lines[this.lines.length - 1].text = newLine;
                            this.cursorPos += pasteData.length;
                        }
                    }
                });
            },

            bindKeyDown() {
                window.addEventListener("keydown", e => {
                    if (this.visible()) {
                        if ((e.ctrlKey || e.metaKey) && e.key === "v") {
                            // e.preventDefault();
                            return;
                        }
                        const lastLineIndex = this.lines.length - 1;
                        const lastLine = this.lines[lastLineIndex].text;
                        if (e.key === "ArrowLeft") {
                            if (this.cursorPos === false) {
                                this.cursorPos = lastLine.length - 1;
                            } else {
                                if (this.cursorPos > this.prefix.length) {
                                    this.cursorPos--;
                                }
                            }
                            return;
                        }
                        if (e.key === "ArrowRight") {
                            if (this.cursorPos === false) {
                                return;
                            }
                            if (this.cursorPos < lastLine.length - 1) {
                                this.cursorPos++;
                            } else if (this.cursorPos === lastLine.length - 1) {
                                this.cursorPos = false;
                            }
                            return;
                        }

                        if (e.key === "ArrowUp") {
                            this.historyChange(-1);
                        } else if (e.key === "ArrowDown") {
                            this.historyChange(1);
                        } else if (e.key === "Enter") {
                            e.preventDefault();
                            const command = lastLine.replace(this.prefix, "");
                            this.run(command);
                        } else if (e.key === "Backspace" || e.key === "Delete") {
                            e.preventDefault();
                            if (lastLine !== this.prefix) {
                                if (this.cursorPos === false) {
                                    this.lines[lastLineIndex].text = lastLine.substring(0, lastLine.length - 1);
                                } else if (this.cursorPos > this.prefix.length) {
                                    this.lines[lastLineIndex].text = lastLine.slice(0, this.cursorPos - 1) + lastLine.slice(this.cursorPos);
                                    if (this.cursorPos === lastLine.length) {
                                        this.cursorPos = false;
                                    } else {
                                        this.cursorPos--;
                                    }
                                }
                            }
                        } else if (e.key.length === 1) {
                            let maxWidth = (this.width / this.charWidth) - 1;
                            if (this.lines[lastLineIndex].text.length >= maxWidth) {
                                this.lines.push(new this.line(
                                    "",
                                    this.colors.primary,
                                    this.colors.secondary
                                ));
                                this.lines[lastLineIndex + 1].text += e.key;
                            } else {
                                if (this.cursorPos === false) {
                                    this.lines[lastLineIndex].text += e.key;
                                } else {
                                    const newLine = lastLine.substring(0, this.cursorPos) + e.key + lastLine.substring(this.cursorPos, lastLine.length);
                                    this.lines[lastLineIndex].text = newLine;
                                    this.cursorPos++;
                                }
                            }
                        }
                    }
                });
            },


            newLine(line, color, link=false) {
                if (typeof line === "undefined") {
                    this.lines.push(new this.line(
                        this.prefix,
                        this.colors.primary,
                        this.colors.secondary,
                        link
                    ));
                } else {
                    if (typeof line !== "object") {
                        line = new this.line(
                            line,
                            this.colors.primary,
                            this.colors.secondary,
                            link
                        );
                    }

                    if (color) {
                        line.color = color;
                    }

                    this.lines.push(line);
                }

                this.curHistoryIndex = this.history.length;
                this.cursorPos = false;
                this.triggerEvent("newline");
                return line;
            },

            log(result, color = this.colors.primary, link=false) {
                const line = this.filterResult(result, color, link);
                this.newLine(line);
            },

            triggerEvent(type) {
                if (Array.isArray(this.events[type])) {
                    this.events[type].forEach(handler => {
                        handler();
                    })
                }
            },

            registerEvent(type, fn) {
                if (!this.events[type]) {
                    this.events[type] = [];
                }

                this.events[type].push(fn);
            },

            filterResult(text, color, link=false) {
                let bg = this.colors.secondary;
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
                    // return false;
                } else if (typeof text === "function") {
                    color = this.colors.orange;
                } else if (typeof text === "undefined") {
                    color = this.colors.grey;
                    return;
                } else if (text instanceof Error) {
                    color = this.colors.red;
                }


                return new this.line(
                    text,
                    color,
                    bg,
                    link
                );
            },

            getLastLine() {
                return this.lines[this.lines.length - 2];
            },

            execute() {
                const lastLine = this.getLastLine();
                if (typeof lastLine.text === "function") {
                    lastLine.text();
                }
                return lastLine.text;
            },

            run(command, nl = true) {
                if (nl) {
                    this.updateHistory(command);
                }
                command.split(" && ").forEach(c => {
                    const line = this.process(c);
                    if (line) {
                        this.newLine(line);
                    }
                });
                if (nl) {
                    this.newLine();
                }
            },

            process(command, nl) {
                let line = new this.line("", this.colors.primary, this.colors.secondary);

                try {
                    let commands = Object.keys(this.commands);
                    let isCommand = false;
                    for (let i = 0; i < commands.length; i++) {
                        const c = commands[i];
                        if (command === c || command.startsWith(c + " ")) {
                            isCommand = true;
                            let params = command
                                .replace(c, '')
                                .trim()
                                .split(' ');
                            params = this.filterParams(params);
                            this.commands[c](params);
                        }
                    };


                    if (isCommand) {
                        return false;
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

            filterParams(params) {
                return params.filter(p => p != "")
                    .join(' ')
                    .replace(/\{{.+?\}}/g, (match, offset, string) => {
                        return eval(match);
                    }).split(' ').map(param => {
                        return isNaN(param) ? param : parseInt(param)
                    });
            },

            getParams() {
                let line = this.lines[this.lines.length - 1].text;
                let params = line.replace(this.prefix, "");
                params = params.split(" ");
                params.shift();
                params.shift();
                params = this.filterParams(params);
                return params;
            },

            updateHistory(command) {
                if (command !== "" && command != this.history[this.history.length - 1]) {
                    this.history.push(command);

                    if (this.history.length >= this.maxHistory) {
                        this.history = this.history.slice(Math.max(this.history.length - this.maxHistory, 0))
                    }


                    localStorage.setItem("cli-history", JSON.stringify(this.history));
                }
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
                this.cursorPos = false;
            },

            finishedLoading() {
                this.newLine(this.prefix);
                this.loaded = true;
            },

            loadPlugin(name, config = {}, callback) {
                let file = "plugins/" + name + ".js";
                fetch(file + "?d=" + new Date().getTime())
                    .then(result => result.text())
                    .then(result => {
                        this.plugins[name] = eval(`${result}`);
                        if (typeof config === "object") {
                            Object.keys(config).forEach(prop => {
                                this.plugins[name][prop] = config[prop];
                            });
                        }

                        if (typeof callback === "function") {
                            callback();
                        }
                    });
            },


            loadPlugins() {
                fetch("./plugins.json")
                    .then(result => result.json())
                    .then(result => {
                        this.plugins = result;
                        let keys = Object.keys(this.plugins);
                        if (keys.length === 0) {
                            this.finishedLoading();
                            return;
                        }
                        let loadedCount = 0;
                        keys.forEach((name, i) => {
                            const config = this.plugins[name];
                            this.loadPlugin(name, config, () => {
                                loadedCount++;

                                if (loadedCount === keys.length) {
                                    this.finishedLoading();
                                }
                            });
                        });
                    })
            },

            loadSketch(name, config = {}) {
                this.loadPlugin("../../sketches/" + name, config);
            },

            update(frame) {
                this.cursor.color = this.colors.primary;
                this.functions.forEach(fn => {
                    if (typeof fn === "function") {
                        fn(this);
                    }
                })
            },

            registerFunction(fn) {
                this.functions.push(fn.bind(this));
                return fn.toString();
            },

            registerCommand(name, handler) {
                this.commands[name] = (params) => {
                    const res = handler(params);
                    if (res !== undefined) {
                        this.log(res);
                    }
                };
            },

            draw() {
                if (this.loaded) {
                    this.background = this.colors.secondary;

                    let lastLineWidth = 0;
                    this.lines.forEach((line, i) => {
                        const text = new Text(line.text, this.textIndent, i * this.lineHeight);
                        text.color = line.color || this.colors.primary;
                        text.fontFamily = this.fontFamily;
                        text.fontSize = this.fontSize;

                        if (line.background) {
                            const bg = new Rect(text.x, text.y + (this.lineHeight / 4), this.width, this.lineHeight);
                            bg.color = line.background;
                            if(line.link) {
                                const origColor = text.color;
                                if(bg.contains(this.mouseX, this.mouseY)) {
                                    text.color = this.colors.secondary;
                                    bg.color = this.colors.primary;
                                    if(this.mouseDown && !line.clicked) {
                                        line.clicked = true;
                                        if(typeof line.link === "string") {
                                            window.open(line.link);
                                        } else if(typeof line.link === "function") {
                                            line.link(this);
                                        }

                                        setTimeout(() => {
                                            line.clicked = false;
                                        }, 400);
                                    }
                                } else {
                                    text.color = origColor;
                                }
                            }
                            
                            this.add(bg);
                        }

                        this.add(text);

                        if (i === this.lines.length - 1) {
                            lastLineWidth = text.width;
                            this.charWidth = lastLineWidth / text.string.length;
                        }
                    });

                    const cursorPos = this.cursorPos === false ? this.lines[this.lines.length - 1].text.length : this.cursorPos;

                    this.cursor.x = this.textIndent + (this.charWidth * cursorPos);
                    this.cursor.y = ((this.lines.length - 1) * this.lineHeight) + 3;
                    this.cursor.height = this.lineHeight;


                    this.add(this.cursor);
                    this.add(this.view);
                }
            }
        });


    }
}


const cmd = new Term();