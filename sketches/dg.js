const game = new Canv('canvas', {
    fullscreen: true,
    setup() {
        this.cols = 10;
        this.rows = 10;


        this.elements = ["absinthe", "adamantite", "air", "airplane", "alcohol", "alcoholic", "alien", "angel", "ant", "antibiotics", "apple", "armor", "ash", "assassin", "astral", "astronaut", "axe", "b-52", "bacteria", "bank", "bard", "beast", "beer", "beetle", "bird", "blood", "boat", "boiler", "book", "bow", "bread", "bricks", "butterfly", "car", "cart", "castle", "cat", "caviar", "cd", "cell phone", "cement", "censored", "ceramics", "chaos", "chariot", "cheese", "cigarette", "claws", "clay", "clock", "clothes", "coal", "coffee", "commandments", "computer", "concrete", "cone of cold", "cookies", "corpse", "credit card", "crop circles", "crossbow", "cyborg", "darkness", "death", "death metal", "debt", "demigod", "demon", "dinosaur", "dog", "dolphin", "domestic animal", "dough", "dragon", "drow", "druid", "duergar", "dust", "dwarf", "earth", "egg", "electricity", "elf", "energy", "fabric", "feather", "fern", "fertilizer", "field", "fire", "firearm", "fireball", "fish", "flour", "flower", "freezer", "frigate", "fun", "games", "ghost", "ghoul", "glass", "goblin", "gold", "golem", "grass", "gunpowder", "hacker", "half-elf", "hammer", "hangover", "healing", "hero", "house", "human", "hunter", "hut", "ice", "ice cream", "illithid", "illusion", "internet", "journalist", "knowledge", "laser", "lava", "law", "life", "light", "lightbulb", "limestone", "lizard", "locomotive", "mace", "magic", "man", "meat", "mechanism", "medicine", "metal", "milk", "mithril", "modron", "molotov cocktail", "money", "moss", "mushroom", "music", "necromancer", "nuclear bomb", "octopus", "oil", "orc", "order", "paladin", "palm tree", "paper", "philospers stone", "phoenix", "pie", "pirate", "plankton", "plasma", "plutonium", "poison", "poisoned weapon", "policeman", "potion", "prayer", "priest", "quicksilver", "radiation", "radio wave", "rat", "reed", "religion", "resurrection", "rock-n-roll", "rocket", "rogue", "rum", "russian roulette", "salt", "saltpeter", "sand", "satellite", "scientist", "scorpion", "scroll", "sea", "seeds", "sex", "shadow", "shell", "ship", "silver", "sin", "skyscraper", "snake", "soldier", "spell", "spell book", "steak", "steam", "steam-engine", "steamship", "stone", "storm", "sugar", "sulfur", "sun", "sunflower", "swamp", "sword", "tavern", "teleport", "tequila", "thunderbird", "tobacco", "tools", "tower", "treant", "tree", "turtle", "tv", "typewriter", "ufo", "underground", "unicorn", "vampire", "virus", "vodka", "void", "waater", "wand", "warrior", "water", "weapon", "weapon", "weeds", "werewolf", "whale", "wheat", "wheel", "white russian", "wizard", "wood", "wool", "work", "worm", "zombie"];
        this.reactions = {
            "earth+fire": ["lava"],
            "air+earth": ["dust"],
            "air+fire": ["energy"],
            "air+energy": ["storm"],
            "dust+fire": ["ash"],
            "air+lava": ["stone"],
            "fire+stone": ["metal"],
            "stone+water": ["sand"],
            "energy+metal": ["electricity"],
            "air+water": ["steam"],
            "metal+steam": ["boiler"],
            "fire+sand": ["glass"],
            "earth+water": ["swamp"],
            "fire+water": ["alcohol"],
            "sand+swamp": ["clay"],
            "energy+swamp": ["life"],
            "alcohol+water": ["vodka"],
            "life+water": ["weeds"],
            "life+swamp": ["bacteria"],
            "swamp+weeds": ["moss"],
            "earth+moss": ["grass"],
            "grass+swamp": ["reed"],
            "bacteria+water": ["plankton"],
            "life+sand": ["seeds"],
            "ash+life": ["ghost"],
            "life+stone": ["egg"],
            "earth+egg": ["dinosaur"],
            "dinosaur+fire": ["dragon"],
            "air+egg": ["bird"],
            "moss+swamp": ["fern"],
            "clay+life": ["golem"],
            "golem+life": ["human"],
            "fire+human": ["corpse"],
            "human+human": ["sex"],
            "corpse+life": ["zombie"],
            "corpse+zombie": ["ghoul"],
            "energy+human": ["wizard"],
            "energy+wizard": ["demigod"],
            "earth+seeds": ["tree"],
            "human+metal": ["armor", "tools"],
            "metal+tools": ["weapon"],
            "human+weapon": ["hunter"],
            "hunter+weapon": ["warrior"],
            "dragon+warrior": ["blood", "hero"],
            "blood+human": ["vampire"],
            "clay+fire": ["bricks"],
            "reed+tools": ["paper"],
            "bird+hunter": ["blood", "feather", "meat"],
            "tools+tree": ["wood"],
            "feather+paper": ["book"],
            "bacteria+swamp": ["sulfur", "worm"],
            "fire+tree": ["ash", "ash", "coal"],
            "boiler+coal": ["steam-engine"],
            "alcohol+human": ["alcoholic"],
            "sand+worm": ["snake"],
            "snake+water": ["fish"],
            "coal+water": ["oil"],
            "fish+plankton": ["whale"],
            "snake+tools": ["poison"],
            "poison+weapon": ["poisoned weapon"],
            "human+poisoned weapon": ["assassin"],
            "tools+wood": ["wheel"],
            "earth+tools": ["field"],
            "field+seeds": ["wheat"],
            "stone+wheat": ["flour"],
            "flour+water": ["dough"],
            "dough+fire": ["bread"],
            "alcohol+bread": ["beer"],
            "egg+sand": ["turtle"],
            "egg+swamp": ["lizard"],
            "wheel+wood": ["cart"],
            "cart+steam-engine": ["locomotive"],
            "bird+fire": ["phoenix"],
            "earth+lizard": ["beast"],
            "beast+vampire": ["werewolf"],
            "earth+worm": ["beetle"],
            "fire+grass": ["tobacco"],
            "beetle+sand": ["scorpion"],
            "paper+tobacco": ["cigarette"],
            "water+wood": ["boat"],
            "beast+cart": ["chariot"],
            "beast+hunter": ["blood", "meat", "wool"],
            "clay+human": ["ceramics"],
            "human+stone": ["dwarf"],
            "plankton+stone": ["shell"],
            "shell+stone": ["limestone"],
            "clay+limestone": ["cement"],
            "tools+wool": ["fabric"],
            "beast+human": ["domestic animal"],
            "life+tree": ["treant"],
            "earth+weeds": ["mushroom"],
            "cement+water": ["concrete"],
            "bricks+concrete": ["house"],
            "beast+fish": ["dolphin"],
            "boat+wood": ["ship"],
            "cart+oil": ["car"],
            "air+car": ["airplane"],
            "fabric+human": ["clothes"],
            "air+worm": ["butterfly"],
            "bird+storm": ["thunderbird"],
            "glass+house": ["skyscraper"],
            "domestic animal+grass": ["fertilizer", "milk"],
            "fertilizer+limestone": ["saltpeter"],
            "saltpeter+sulfur": ["gunpowder"],
            "gunpowder+weapon": ["firearm"],
            "fabric+ship": ["frigate"],
            "ship+steam-engine": ["steamship"],
            "sand+tree": ["palm tree"],
            "glass+void": ["lightbulb"],
            "electricity+void": ["radio wave"],
            "lightbulb+radio wave": ["tv"],
            "book+tv": ["computer"],
            "radio wave+radio wave": ["radiation"],
            "metal+radiation": ["plutonium"],
            "plutonium+weapon": ["nuclear bomb"],
            "computer+radio wave": ["cell phone"],
            "energy+fire": ["plasma"],
            "plasma+void": ["sun"],
            "grass+sun": ["flower"],
            "flower+sun": ["sunflower"],
            "flower+tree": ["apple"],
            "energy+seeds": ["coffee"],
            "airplane+void": ["rocket"],
            "rocket+void": ["satellite"],
            "fire+radio wave": ["laser"],
            "book+laser": ["cd"],
            "metal+water": ["quicksilver"],
            "demigod+quicksilver": ["philospers stone"],
            "apple+cell phone": ["gold"],
            "computer+human": ["cyborg"],
            "computer+computer": ["internet"],
            "commandments+human": ["religion"],
            "human+religion": ["law", "sin"],
            "beast+house": ["cat", "dog"],
            "law+tools": ["mechanism"],
            "alcoholic+ship": ["pirate"],
            "alcoholic+house": ["tavern"],
            "glass+sand": ["clock"],
            "glass+waater": ["ice"],
            "book+human": ["knowledge"],
            "firearm+warrior": ["soldier"],
            "gold+paper": ["money"],
            "fish+knowledge": ["octopus"],
            "bacteria+milk": ["cheese"],
            "human+money": ["work"],
            "beetle+work": ["ant"],
            "bacteria+human": ["virus"],
            "book+mechanism": ["typewriter"],
            "human+knowledge": ["scientist"],
            "egg+fish": ["caviar"],
            "apple+dough": ["pie"],
            "law+soldier": ["policeman"],
            "ice+milk": ["ice cream"],
            "knowledge+virus": ["medicine"],
            "fire+meat": ["steak"],
            "field+reed": ["sugar"],
            "ice+mechanism": ["freezer"],
            "human+sex": ["fun"],
            "human+reed": ["music"],
            "human+rocket": ["astronaut"],
            "corpse+electricity": ["death metal"],
            "bacteria+medicine": ["antibiotics"],
            "alcohol+music": ["rock-n-roll"],
            "alcohol+grass": ["absinthe"],
            "money+skyscraper": ["bank"],
            "computer+virus": ["hacker"],
            "coffee+vodka": ["b-52"],
            "fun+law": ["games"],
            "alcohol+pirate": ["rum"],
            "pirate+vodka": ["rum"],
            "bread+sugar": ["cookies"],
            "alcoholic+money": ["hangover"],
            "bank+money": ["debt"],
            "debt+money": ["credit card"],
            "firearm+vodka": ["russian roulette"],
            "sex+sex": ["censored"],
            "human+typewriter": ["journalist"],
            "life+void": ["chaos", "order"],
            "fire+vodka": ["molotov cocktail"],
            "milk+vodka": ["white russian"],
            "water+water": ["sea"],
            "sea+sun": ["salt"],
            "alien+rocket": ["ufo"],
            "beast+medicine": ["rat"],
            "vodka+worm": ["tequila"],
            "ufo+wheat": ["crop circles"],
            "magic+void": ["darkness", "light"],
            "knowledge+magic": ["spell"],
            "magic+music": ["bard"],
            "magic+religion": ["priest"],
            "magic+priest": ["prayer"],
            "magic+water": ["potion"],
            "beast+magic": ["unicorn"],
            "magic+paper": ["scroll"],
            "darkness+light": ["shadow"],
            "air+spell": ["illusion"],
            "ice+spell": ["cone of cold"],
            "fire+spell": ["fireball"],
            "book+spell": ["spell book"],
            "prayer+priest": ["healing"],
            "life+light": ["angel"],
            "darkness+earth": ["underground"],
            "wizard+zombie": ["necromancer"],
            "house+wizard": ["tower"],
            "beast+darkness": ["demon"],
            "darkness+energy": ["death"],
            "death+healing": ["resurrection"],
            "priest+warrior": ["paladin"],
            "chaos+void": ["astral"],
            "astral+spell": ["teleport"],
            "astral+death": ["illithid"],
            "astral+metal": ["silver"],
            "assassin+law": ["rogue"],
            "life+mechanism": ["modron"],
            "human+weapon": ["crossbow", "sword"],
            "human+magic": ["elf"],
            "elf+human": ["half-elf"],
            "human+swamp": ["goblin", "orc"],
            "human+tree": ["druid"],
            "darkness+elf": ["drow"],
            "elf+metal": ["mithril"],
            "elf+weapon": ["bow"],
            "armor+house": ["castle"],
            "magic+weapon": ["wand"],
            "priest+weapon": ["mace"],
            "drow+metal": ["adamantite"],
            "darkness+dwarf": ["duergar"],
            "dwarf+weapon": ["axe", "hammer"],
            "beast+weapon": ["claws"]
        }
        this.discovered = localStorage["discovered"] ? JSON.parse(localStorage.getItem("discovered")) : ["air", "earth", "fire", "water"];

        this.elrenders = [];

        this.selected = [];
    },

    findReaction(element) {
        return Object.keys(this.reactions)[Object.values(this.reactions).map((e,i)=>e.includes(element)?i:false).filter(e=>e!=false)[0]]
    },

    findPossible(element) {
        const possible = {};
        const combos = Object.keys(this.reactions);
        combos.forEach((combo, i) => {
            combo = combo.split("+");
            if(combo.includes(element)) {
                possible[combo] = this.reactions[combos[i]];
            }
        });

        return possible;
    },

    getReaction(first, second) {
        if (this.discovered.indexOf(first) > -1 && this.discovered.indexOf(second) > -1) {
            const reaction = this.reactions[[first, second].sort().join('+')];
            return reaction ? reaction : false;
        }
        return false;
    },


    combine(first, second) {
        const reaction = this.getReaction(first, second);
        if (reaction) {
            reaction.forEach(element => {
                if (this.discovered.indexOf(element) < 0) {
                    this.discovered.push(element);
                }
            });
        }
        localStorage.setItem("discovered", JSON.stringify(this.discovered))
        return reaction;
    },


    update() {
        if (this.elrenders.length !== this.discovered.length) {
            const w = this.width / this.cols;
            const h = this.height / this.rows;
            this.elrenders = this.discovered.map((element, index) => {
                let x = Math.floor(index % this.cols) * w;
                let y = Math.floor(index / this.cols) * h;
                let bounds = new Rect(x, y, w, h);
                bounds.color = new Color(255);
                bounds.showStroke = true;
                return new ShapeGroup({
                    bounds,
                    // img: new Pic("images/elements/"+element+".png",x,y,w,h),
                    txt: new Text(element, x + (w / 2), y + (h / 2)).setAlign("center").setSize(12)
                });
            });
        }

        if(this.selected.length === 2) {
            this.combine(...this.selected);
            this.selected = [];
        }

        this.elrenders = this.elrenders.map((elrender, index) => {
            const element = this.discovered[index];
            const selected = (this.selected.indexOf(element) > -1);
            if (selected) {
                elrender.bounds.color = new Color(10, 100, 255);
            }

            if (elrender.contains(this.mouseX, this.mouseY)) {
                if (!selected) {
                    elrender.bounds.color = new Color(230);
                }
                if (this.mouseDown && !this.clicked) {
                    this.clicked = true;

                    if (selected) {
                        this.selected.splice(this.selected.indexOf(element), 1);
                    } else {
                        this.selected.push(element);
                    }

                    setTimeout(() => {
                        this.clicked = false
                    }, 200);
                }
            } else if (!selected) {
                elrender.bounds.color = new Color(255);
            }
            return elrender;
        });
    },

    // this.add(new Rect(x,y,w,h).setColor(Color.random()));
    // this.add(new Pic("images/elements/"+el+".png",x,y,w,h));


    draw() {
        this.clear();
        this.elrenders.forEach(element_render => {
            this.add(element_render);
        });
    }
});