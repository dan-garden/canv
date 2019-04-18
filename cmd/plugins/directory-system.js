new Canv('canvas', {
    fullscreen: true,
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




        this.path = "/Folder 1/";


        cmd.registerCommand("ls", (params) => {
            cmd.prefix = this.path + "> ";
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


        cmd.registerCommand("cd", (params) => {
            
        })
    },



    getCurrent(path) {
        path = path || this.path.split('/').filter(m=>m!=="") || path;
        let dir = this.structure;
        for(let i = 0; i < path.length; i++) {
            dir = dir.filter ? 
            dir.filter(d=> d.type === "dir" && d.name === path[i])[0] :
            dir.content.filter(d=> d.type === "dir" && d.name === path[i])[0];

            if(!dir) {
                return undefined;
            }
        }
        return dir;
    }
})