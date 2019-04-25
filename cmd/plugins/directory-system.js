new Canv('canvas', {
    setup() {
        this.structure = [
            {
                type: "file",
                name: "file1.json",
                content: `{
                    status: success,
                    data: [
                        { "name": "Daniel Garden", age: 22 }
                        { "name": "Karl Hubbard", age: 22 }
                        { "name": "James Towers", age: 19 }
                    ]
                }`
            },
            {
                type: "dir",
                name: "Folder 1",
                content: [
                    {
                        type: "file",
                        name: "test.txt",
                        content: "this is the file contents of text"
                    },
                    {
                        type: "file",
                        name: "test2.txt",
                        content: "Testing file 2"
                    },
                    {
                        type: "file",
                        name: "image.png",
                        content: "{{image-content}}"
                    },
                    {
                        type: "dir",
                        name: "New Folder",
                        content: [
                            {
                                type: "file",
                                name: "misc-image.jpeg",
                                content: "{{image-content}}"
                            }
                        ]
                    }
                ]
            }
        ];




        this.path = "/";


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
                return new Error("Directory doesn't exist")
            }
        });

        cmd.registerCommand("open", args => {
            const found = this.open(args.join(" "));

            if(found) {
                const lines = found.content.split("\n");
                lines.forEach(line => {
                    cmd.newLine(line);
                })
            } else {
                return found;
            }
        })
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
                return new Error("File does not exist");
            }
        }
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