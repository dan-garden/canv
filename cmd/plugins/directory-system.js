new Canv('canvas', {
    setup() {
        this.structure = localStorage["cli-structure"] ?
        JSON.parse(localStorage.getItem("cli-structure")) : [];




        this.path = "/";
        this.updatePrefix();


        cmd.registerCommand("ls", args => {
            this.updatePrefix();
            const dir = this.getCurrent();
            if(dir) {
                const content = dir.content || dir;
                for(let i = 0; i < content.length; i++) {
                    const struct = content[i];
                    if(struct.type === "dir") {
                        cmd.newLine(struct.name, cmd.colors.blue);
                    } else {
                        cmd.newLine(struct.name, cmd.colors.green);
                    }
                }
            } else {

            }
            return undefined;
        });


        cmd.registerCommand("cd", args => {
            const exists = this.changeDirectory(args.join(" ") || this.path);
            this.updatePrefix();
            if(!exists) {
                throw new Error("Directory not found");
            }
        });

        cmd.registerCommand("open", args => {
            const found = this.open(args.join(" "));
            if(found) {
                const lines = found.content.split("\n");
                lines.forEach(line => {
                    cmd.newLine(line);
                })
            }
        });

        cmd.registerCommand("del", args => {
            return this.delete(args.join(" "));
        })


        cmd.registerCommand("touch", args => {
            const filename = args.join(" ");
            if(filename) {
                this.getCurrent().push({
                    name: filename,
                    type: "file",
                    content: ""
                });
            }
            this.updateStructure();
        });

        cmd.registerCommand("mkdir", args => {
            const filename = args.join(" ");
            if(filename) {
                this.getCurrent().push({
                    name: filename,
                    type: "dir",
                    content: []
                });
            }
            this.updateStructure();
        });


        cmd.registerCommand("edit", args => {
            const filename = args.shift();
            const found = this.open(filename);
            if(found) {
                this.edit(filename, args.join(" "));
            }
        });

        cmd.registerCommand("editor", args => {  
            const filename = args.shift();
            const found = this.open(filename);

            if(found) {
                const textarea = document.createElement("textarea");
                textarea.value = found.content;
                const button = document.createElement('button');
                button.innerHTML = 'Save';
                const editor = new cmd.popup(filename, [textarea, document.createElement("br"), button]);
                button.onclick = () => {
                    editor.close();
                    this.edit(filename, textarea.value);
                };
            }
        })
    },

    edit(filename, content) {
        const found = this.open(filename);
        if(found) {
            found.content = content;
            this.updateStructure();
        }
    },

    delete(filename) {
        if(filename) {
            const cur = this.getCurrent();        
            cur.forEach((file, i) => {
                if(file.name === filename) {
                    cur.splice(i, 1);
                }
            });
            this.updateStructure();
        }
    },

    open(filename) {
        if(filename) {
            const cur = this.getCurrent();        
            const search = cur.filter(file => {
                return file.name === filename;
            });
            if(search && search[0]) {
                return search[0].type === "file" ? search[0] : undefined;
            } else {
                throw new Error('File not found')
            }
        }
    },

    updateStructure() {
        localStorage.setItem("cli-structure", JSON.stringify(this.structure));
    },

    getPath(path) {
        return path || this.path.split('/').filter(m=>m!=="") || path;
    },

    changeDirectory(dir) {
        if(dir === this.path || dir === ".") {
            return true;
        } else if(dir === "..") {
            const path = this.getPath();
            path.pop();
            this.path = "/" + path.join("/");
            return true;
        } else {
            const cur = this.path;
            let path = this.getPath();
            path.push(...dir.split('/'));
            path = this.getPath("/" + path.join('/'));
            this.path = path;
            if(!this.getCurrent()) {
                this.path = cur;
                return false;
            } else {
                return true;
            }
        }
    },

    updatePrefix() {
        const path = this.getPath();
        let displayPath = "~"
        if(path.length > 0) {
            displayPath = path[path.length-1];
        }
        cmd.prefix = "" + displayPath + " $ ";
    },


    getCurrent(path) {
        path = this.getPath(path);
        let dir = this.structure;
        for(let i = 0; i < path.length; i++) {
            dir = dir.filter ? 
            dir.filter(d=> d.type === "dir" && d.name === path[i])[0] :
            dir.content.filter(d=> d.type === "dir" && d.name === path[i])[0];

            if(!dir) {
                return undefined;
            }
        }
        return dir.content ? dir.content : dir;
    }
})