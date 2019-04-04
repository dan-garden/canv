const m = new Canv('canvas', {
    width: 500,
    height: 500,
    fontSize: 12,
    setup() {
        this.chars = "会帳埼残憎健魅稿間業連読携昨度。査教惣込間転軽部可小選通拓。連今二空際匹質情発写真竹光住遺。香町心辞相戦業推取図以他。平活相天連外事引面愛広状感倉主。同駐始可予区人秋内果画井化京点。親著職仲事質免必史新報入転金消個京。座中抑究務秀英得問京座官張課始合全。球新左心部去族野優割作党欠。吸交覧能護大逮供策内業活位競。向完面闘応健既行交住山規面昨漂身載。策表故企線約意手韓読軽級提首瀬。権特出職屋低的己旬討行中速除初含央。報加変上別論実掲給社盟武碁支。税琴全人勝権労物北容品繰高庫。内高視立我議田作趣家条玲一第企。携処東手日題子回末円速世能独毎密婦小近併。別議見花気中帯歳銀投写行死遺季国名。答一検坊議内年断談警導手前";
        this.rain = [];
    },

    randomChar() {
        return this.chars[Canv.random(0, this.chars.length-1)];
    },

    randomCol() {
        return Canv.random(0, this.width/this.fontSize) * this.fontSize;
    },

    update() {
        let t = new Text("", this.randomCol(), Canv.random((-this.fontSize)*10), 0);
        t.fontSize = Canv.random(this.fontSize / 2, this.fontSize);
        t.color = new Color(0, 250, 50);
        this.rain.push(t);

        for(let i = this.rain.length-1; i > 0; i--) {
            if(this.rain[i].y > this.height) {
                this.rain.splice(i, 1);
            } else {
                this.rain[i].y += Canv.random(1, 2);
                if(this.frames % 5 === 0) {
                    this.rain[i].string = this.randomChar(); 
                }
            }
        }
    },

    draw() {
        this.background = new Color(0);
        this.rain.forEach(c => this.add(c));
    }
})