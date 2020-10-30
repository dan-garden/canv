const app = new Canv('canvas', {
    async setup() {
        const req = await fetch("https://majoreventsgc.com/wp-json/wp/v2/pages");
        this.pages = await req.json();
    },

    changePage(num) {
        document.body.innerHTML = this.pages[num].content.rendered;
    },

    update() {

    },

    draw() {

    }
})