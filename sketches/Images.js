new Canv('canvas', {
    width: 400,
    height: 400,
    img: new Pic('test.jpg'),
    setup() {
        this.background = "orange";

        console.log(this.pixels);
    },
    // update() {

    // },

    // draw() {
        
    // }
})