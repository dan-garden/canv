const views = new Canv('canvas', {
    fullscreen: true,
    views: {},

    registerView(viewName, view) {
        
    },

    changeView(viewName) {

    },

    setup() {
        this.registerView("home", new ShapeGroup({

        }))
    }
})