const game = new Canv('canvas', {
    width: 100,
    height: 100,
    sprite_frame: 0,
    sprite_count: 10,
    setup() {
        this.sprites = [];
        for(let i = 0; i < this.sprite_count; i++) {
            let sprite = new Pic('sprites/tile00'+i+'.png',0,0,this.width,this.height);
            this.sprites.push(sprite);
        }

        this.updateDelay = 50;
    },
    update() {
        this.sprite_frame++;
    },
    draw() {
        this.background = new Color(200)
        this.add(this.sprites[this.sprite_frame % (this.sprite_count)]);
    }
});