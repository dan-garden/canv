new Canv('canvas', {
    words: ["eager","smile","tangible","thoughtful","middle","fancy","hands","wail","guiltless","float","fence","tooth","alcoholic","cat","carry","bloody","nosy","absent","achiever","bike","hang","untidy","slimy","sneeze","therapeutic","lopsided","advice","crate","pet","befitting","room","animal","separate","cart","resolute","reaction","agree","new","snail","worried","waggish","elbow","play","freezing","historical","wealth","elastic","writer","staking","airport","enter","butter","rest","tour","poison","nondescript","whistle","adjustment","enchanting","straw","mailbox","moon","spiky","jobless","roll","macabre","infamous","destruction","neighborly","reduce","spiders","detail","cough","son","argue","shaky","interesting","space","stop","null","intelligent","help","territory","yellow","pan","well-groomed","billowy","border","load","winter","mushy","zealous","numerous","marked","rate","punish","thumb","fast","beg","natural","weigh","unbecoming","dance","grate","permissible","join","filthy","uppity","addition","excite","invention","concentrate","grape","wealthy","motion","imagine","opposite","humdrum","sore","crack","join","expert","home","invite","halting","wing","ground","rabbit","care","seashore","learned","mix","discussion","naive","combative","cub","toothsome","exotic","strip","knowledge","craven","sister","holiday","brash","food","unsuitable","quack","flowery","alert","fanatical","fear","vigorous","stare","godly","stomach","observant","high","action","nut","return","train","shaggy","flat","adventurous","groan","jittery","allow","time","coil","mine","mug","bedroom","ragged","seal","obsequious","ad hoc","cave","fancy","previous","scare","illegal","next","part","muddled","spiritual","meat","string","capricious","intend","aunt","bawdy","screeching","efficacious","miscreant","familiar","grotesque","drip","adhesive","blue","creepy","boil","meaty","upbeat","jewel","tickle","defiant","queue","zephyr","illustrious","deserve","rabid","kind","roomy","rush","stocking","arrogant","oven","observe","bubble","chicken","soothe","joyous","gusty","laugh","linen","beautiful","flood","greet","right","shop","like","chance","gentle","solid","overt","cable","bite","uncle","possible","odd","color","hand","gainful","level","beginner","pathetic","cows","gigantic","coordinated","guarded","wholesale","inform","meeting","queen","breathe","cowardly","wet","cheap","clear","road","gabby","scribble","sad","knee","hesitant","scarf","horrible","reflect","value","screw","notebook","steep","view","sordid","acid","precede","switch","repair","birth","fortunate","irritating","dangerous","luxuriant","crown","pump","ink","pig","quilt","wacky","fetch","pedal","legal","toy","eggs","car","use","satisfying","organic","gather","disagreeable","mask","thundering","vase","pies","abstracted","class","whine","belong","sand","pump","oranges","nation","truculent","slim","sweater","important","juicy","carriage","clip","careless","coast","flawless","sail","support","pick","wide-eyed","quick","lush","land","grab","physical","nostalgic","thirsty","afford","dapper","answer","hammer","third","tart","celery","chickens","boundary","nail","chalk","practise","trains","authority","voracious","thin","tangy","yell","button","soggy","cattle","month","paper","damaging","pop","fill","error","soup","word","produce","fix","innate","glamorous","panoramic","expect","nasty","cool","faulty","houses","magnificent","old","symptomatic","appear","awake","wine","mark","undesirable","rule","heartbreaking","appliance","sable","representative","kittens","icicle","collect","cup","cute","connection","selective","place","dusty","night","prick","windy","frequent","release","brave","distinct","unruly","repeat","coil","arm","steel","sack","zebra","railway","prose","store","day","entertaining","noisy","absorbed","sisters","ablaze","cross","normal","picayune","enchanted","trip","house","disagree","talented","shade","preserve","goofy","brass","mend","welcome","sophisticated","fade","trade","texture","aloof","fang","wakeful","vagabond","acidic","clear","flock","snotty","bucket","ball","refuse","assorted","auspicious","probable","quirky","cover","clumsy","jam","remarkable","slow","simple","exchange","chilly","gaping","three","nutty","guide","private","happy","men","unusual","thunder","impartial","wise","condition","witty","accurate","nonchalant","toys","angle","optimal","subtract","brick","note","horse","aromatic","circle","fallacious","silver","near","travel","route","macho","ear","cherries","hose","large","fierce","arrive","tacky","vest","cake","radiate","onerous","request"],
    
    difficulty: 8,

    setup() {
        cmd.registerCommand("hang", args => {
            if(args.length >= 1) {
                const arg = args[0];
                if(arg === "new") {
                    return this.reset();
                } else if(arg === "show") {
                    return this.word;
                } else if(arg === "len") {
                    return this.word.length;
                } else {
                    const r = this.guessChar(arg);
                    return r;
                } 
            } else {
                return this.guess;
            }
        });


        this.reset();
    },


    reset() {
        this.word = this.randomWord();
        this.guess = new Array(this.word.length).fill("-").join("")
        return this.guess;
    },

    guessChar(character) {
        for(let i = 0; i < this.word.length; i++) {
            let wordchar = this.word[i];

            character.split("").forEach(char => {
                if(wordchar === char) {
                    this.guess = this.guess.split("").map((c, j) => {
                        return j === i ? char : c;
                    }).join("");
                }
            })
        }


        if(this.word === this.guess) {
            return "Congrats! The word is: "+this.word;
        } else {
            return this.guess;
        }
    },

    randomWord() {
        const words = this.words.filter(w => w.length >= this.difficulty);
        return words[Math.floor(Math.random() * words.length)];
    }
})