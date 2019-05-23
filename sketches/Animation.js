const space = new Canv('canvas', {
    setup() {
        this.planets = {
            // pluto: {
            //     i: 10,
            //     color: new Color(255),
            //     angle: -90,
            //     speed: 1,
            //     radius: 5
            // },
            neptune: {
                i: 9,
                color: new Color(12, 83, 255),
                angle: -20,
                speed: 0.0543,
                radius: 45
            },
            uranus: {
                i: 8,
                color: new Color(16, 184, 241),
                angle: -30,
                speed: 0.0681,
                radius: 55
            },
            saturn: {
                i: 7,
                color: new Color(235, 192, 89),
                angle: -10,
                speed: 0.0969,
                radius: 45
            },
            jupiter: {
                i: 6,
                color: new Color(190, 142, 25),
                angle: -25,
                speed: 0.1307,
                radius: 80
            },
            mars: {
                i: 5,
                color: new Color(244, 62, 0),
                angle: -40,
                speed: 0.24077,
                radius: 45
            },
            earth: {
                i: 4,
                color: new Color(0, 220, 10),
                angle: -20,
                speed: 0.2978,
                radius: 60
            },
            venus: {
                i: 3,
                color: new Color(252, 223, 153),
                angle: -50,
                speed: 0.3502,
                radius: 30
            },
            mercury: {
                i: 2,
                color: new Color(150),
                angle: -20,
                speed: 0.4787,
                radius: 30
            },
        };
        this.background = 0;
        this.time = 0;
        this.zoom = 1;
        this.speed = 5;
        this.starCount = 2;
        this.stars = new ShapeGroup();
        this.sun = new Circle(0, 0, 0).setColor(new Color(255, 215, 0));
    },
    update() {
        this.time += this.speed;
        this.zoom += 0.01;
        this.pos = new Vector(this.halfWidth(), this.halfHeight());
        for(let i = 0; i < this.starCount; i++) {
            this.stars.add(new Circle(this.randomWidth, this.randomHeight, 1).setColor(255))
        }
        this.stars.shrink(0.01);
        this.stars.forEach((s, i) => {if(s.size<0){this.stars.remove(i)}})

        const r = this.width / this.zoom;
        this.sun.setPos(this.pos.x, this.pos.y);
        this.sun.radius = r;
    },
    draw() {
        // this.background = 0;

        this.solarSystem = new ShapeGroup([this.stars, 
            ...Object.keys(this.planets).map(planet => {
                planet = this.planets[planet];
                const a = (planet.angle - (this.time * planet.speed));
                return new ShapeGroup({
                    planet: new Circle(
                        this.sun.x + ((this.sun.radius * planet.i) * Math.cos(a * Math.PI / 180)),
                        this.sun.y + ((this.sun.radius * planet.i) * Math.sin(a * Math.PI / 180)),
                        this.sun.radius / 140 * planet.radius).setColor(planet.color),
                    orbit: new Circle(this.sun.x, this.sun.y, (this.sun.radius * planet.i))
                        .noFill()
                        .setStroke(50)
                })
            }), this.sun
        ])
        this.add(this.solarSystem);
    }
})