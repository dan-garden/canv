new Canv('canvas', {
    setup() {
        this.notes = localStorage["notes"] ? localStorage.getItem("notes") : [];

        cmd.registerCommand('notes', args => {
            return this.notes;
        });

        cmd.registerCommand('new note', args => {
            this.notes.push(args.join(" "));
            localStorage.setItem("notes", this.notes);
        })
    }
})