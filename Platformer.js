// ---- untitled platforming game, origional game ----

var platCatSpr = "%3!%!%5!%!%4!4%4!4%b!m%2!6%!@m!2@6!%4!4@4!@!@2!2@5%!a%2!2%P1!@!@!%3!@!@!%2!@4!%2!2@3!%2!3%!%2!@m!2@6!2@m!2@6!%2!%!4@!2@!3@!@2!@!@!2%a!2%2!%O1!@3!%3!@3!%!@6!3@5!2@3!@!%!@m!2@6!2@m!2@6!%4!4@!2@!3@!@!3@!3%a!2%2!%N1!@4!%2!@4!%!@2!2@2!3@2!@2!2@!@4!2@m!2@6!2@m!2@6!%4!4@8!@2!@!@2!%a!2%2!%N1!@4!%2!@4!%!@2!2@2!3@2!@2!2@3!3%!@m!2@6!2@m!2@6!5%k!%a!2%2!%N1!@4!%2!@4!%!@6!3@5!%!3%4!@m!2@6!2@m!2@6!2%2!%!2%7@4!5@!%a!2%2!%N1!@2!2%4!2@2!%2!@4!%2!2@3!%9!@m!2@6!2@m!2@6!2%2!2@2!%6!4@5!2%a!2%2!%O1!2%8!2%4!4%4!4%a!@m!2@6!%!m%2!6%!4@4%g!%a!2%2!%P1!%!%5!%!%4!4%5!2%6!2%3!@m!2@6!%!m%2!6%3!5%@2!5@2%@%@%@%!%a!2%2!%O1!@!@!%3!@!@!%2!3@!2%3!2@!%5!2%3!@m!2@6!2@m!2@6!%!@5!@!%4!2%@%@%@%@!%a!2%2!%O1!@3!%3!@3!%2!2@3!%3!2@!%5!2%3!@m!2@6!2@m!2@6!%!@5!@!%4!2@%@%@%@%!%a!2%2!%N1!@4!%2!@4!%2!2@!@!%3!4%5!2%3!@m!2@6!2@m!2@6!%!@5!@!%4!2%@%@%@%@%!a%2!2%N1!@6!%!@4!%2!2@!@!%3!4%5!2%3!@m!2@6!2@m!2@6!%!@!@3!@!%4!2@%@%@%@%2!a%2!2%N1!@6!%!@4!%2!2@3!%3!2@!%5!2%3!@m!2@6!2@m!2@6!%!@!@3!@!%4!2%@%@%@%@!%a!2%2!%N1!6%2!@4!%2!3@!2%3!2@!%5!2%3!@m!2@6!2@m!2@6!%!@5!@!%4!2@%@%@%@%!%a!2%2!%W1!4%4!4%5!2%6!2%3!@m!2@6!%!m%2!6%2!@5!@!%4!2%@%@%@%@%!a%2!2%N1"

createGame(function (R) {
    R.setSpriteSheet("platCatSpr"); // set sprite sheet
    let frameCount = 0;

    // game variables here
    this.cat;
    this.camera;
    this.actors = [];
    let curtainY = 0;

    this.score = 0;

    this.maps = [];

    // starts the game
    let newGame = (map) => {
        this.loadMaps();
        if (!this.maps) this.newMap();

        this.camera = createVector();

        // reset game variables here
        this.cat = false;
        this.door = false;

        this.actors = [];

        this.score = 0;
        curtainY = 0;

        this.draw = this.game; // make draw loop the game loop

        this.mapIndex = map;
        this.map = this.maps[this.mapIndex];

        let mapHasKey = false;

        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i] == 3) new Coin(this, (i % MW) * 8, floor(i / MW) * 8);
            if (this.map[i] == 4) this.cat = new Cat(this, (i % MW) * 8, floor(i / MW) * 8);
            if (this.map[i] == 5) this.door = new Door(this, (i % MW) * 8, floor(i / MW) * 8);
            if (this.map[i] == 6) {
                new Key(this, (i % MW) * 8, floor(i / MW) * 8);
                mapHasKey = true;
            }
        }

        if (mapHasKey) this.door.open = false;

        if (!this.cat) {
            this.selection = 0;
            this.lastUpdate = this.title;
            this.draw = this.pause;
        }
    }

    this.selection = 1;
    this.lastUpdate = this.title;

    this.mapBuilder;

    // pause screen
    this.pause = () => {
        R.cls(1);

        R.lset(9); // set layer to highest

        R.put("pause", 8, 8, 22);

        if ((btn.up && !pbtn.up) && this.selection == 1) this.selection = 0;
        if ((btn.down && !pbtn.down) && this.selection == 0) this.selection = 1;

        let s = ">EDITOR\n RESUME";
        if (this.selection == 1) s = " EDITOR\n>RESUME";

        R.put(s, 0, 18, 22);

        if (btn.start && !pbtn.start) this.draw = this.lastUpdate;

        if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b)) {
            if (this.selection == 0) {
                this.draw = this.mapBuilderUpdate;
                // if (!this.mapBuilder)
                this.mapBuilder = new MapBuilder(this);
            }
            else this.draw = this.lastUpdate; // if button pressed go to game loop
        }
    }

    this.onUnfocus = () => { // this function runs when unfocusing the game boy
        // pauses when game is running
        if (this.draw != this.pause) this.lastUpdate = this.draw;
        if (this.draw == this.game) this.draw = this.pause;
    }

    // title screen
    this.title = () => {
        frameCount++;
        R.cls(1); // clear screen to black

        // R.palset(22, 22);
        // R.spr([40, 0], 32 - 25, 4, 50, 16);
        // R.palset(64, 22, 22);
        // R.spr([40, 0], 32 - 25, 20, 50, 16);

        R.palset(22, 1);
        let f = [[16, 0], [24, 0], [16, 8], [24, 8], [32, 8], [24, 8], [16, 8], [24, 0], [16, 0]][floor(frameCount / 4) % 8];
        R.spr(f, 19, 34, 8, 8, floor(frameCount / 4) % 8 > 4);

        let s = this.score + "";
        if (s.length == 1) s = "0" + s;
        R.put(s, 38 - 9, 35, 22);

        if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) newGame(0); // if button pressed start new game

        if (curtainY > 0) {
            curtainY -= 2;

            R.palset(1);
            R.fillRect(0, 48 - curtainY, 64, 48);
        }

        if (btn.start && !pbtn.start) {
            this.lastUpdate = this.draw;
            this.draw = this.pause;
        }
    }
    this.draw = this.title; // make draw loop the titlescreen

    // game loop
    this.game = () => {
        frameCount++;
        R.cls(1); // clear screen to black
        R.palset(22, 1); // set to basic palette

        this.cat.update();
        for (let i = this.actors.length - 1; i >= 0; i--) this.actors[i].update();

        // this.camera.set(this.cat.pos.x - 32, this.cat.pos.y - 24);
        this.camera.set(floor(this.cat.pos.x / 64) * 64, min(floor(this.cat.pos.y / 48) * 48, 48));

        for (let i = this.actors.length - 1; i >= 0; i--) this.actors[i].draw();
        this.cat.draw();
        this.displayMap();

        if (this.door.open && this.cat.within(this.door)) newGame((this.mapIndex + 1) % this.maps.length);

        if (this.cat.dead && this.cat.pos.y > 48 + 16 && this.cat.vel.y > 0) {
            if (curtainY > 48) this.draw = this.title;
            curtainY += 2;

            R.palset(1);
            R.fillRect(0, 0, 64, curtainY);
        }

        if (btn.start && !pbtn.start) {
            this.lastUpdate = this.draw;
            this.draw = this.pause; // if start button pressed, go to pause screen
        }

    }

    function Coin(game, x, y) {
        game.actors.push(this);
        this.size = createVector(4, 4);
        this.pos = createVector(x + 2, y + 2);
        this.vel = createVector(0, 0);

        this.update = () => {
            if (!game.cat.dead && game.cat.hit(this)) this.collect();
        }

        this.draw = () => {
            R.palset(22, 1);
            let f = [[16, 0], [24, 0], [16, 8], [24, 8], [32, 8], [24, 8], [16, 8], [24, 0], [16, 0]][floor(frameCount / 4) % 8];
            R.spr(f, floor(this.pos.x) - 2 - game.camera.x, floor(this.pos.y) - 2 - game.camera.y - 1 * sin(frameCount / 15), 8, 8, floor(frameCount / 4) % 8 > 4);

            // R.palset(5);
            // R.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        this.collect = () => {
            game.actors.splice(game.actors.indexOf(this), 1);
            game.score++;
        }
    }

    function Door(game, x, y) {
        game.actors.push(this);
        this.size = createVector(8, 9);
        this.pos = createVector(x, y);
        this.vel = createVector();

        this.open = true;

        this.draw = () => {
            R.spr([this.open ? 112 : 104, 8], this.pos.x - game.camera.x, this.pos.y - game.camera.y);
        }

        this.update = () => {
        }
    }

    function Key(game, x, y) {
        game.actors.push(this);
        this.size = createVector(4, 4);
        this.pos = createVector(x + 2, y + 1);
        this.vel = createVector();

        this.collected = false;

        this.draw = () => {
            R.lset(1);
            R.spr([32, 0], this.pos.x - 2 - game.camera.x, this.pos.y - 2 - game.camera.y + 1 * sin(frameCount / 15));
        }

        this.update = () => {
            if (game.cat.hit(this) && !this.collected) {
                this.collected = true;
            }

            if (!this.collected) return;

            let dest = game.cat.pos.copy();
            dest.add(game.cat.dir ? 5 : -5, -2);

            this.pos.add(dest.sub(this.pos).div(8));

            if (game.cat.hit(game.door) && !game.door.open) {
                game.door.open = true;
                game.actors.splice(game.actors.indexOf(this), 1);
            }
        }
    }

    function Cat(game, x, y) {
        this.size = createVector(4, 4);
        this.pos = createVector(x + 2, y + 4);
        this.vel = createVector();
        this.bounce = 0;
        this.gravityScale = 1;
        this.grounded = false;
        this.wallded = false;
        let jumpDir = 0;

        this.collided = () => {
            if (this.pos.x < 0 || this.pos.x + this.size.x > game.width * 2) return true;
            if (this.pos.y < 0 /*|| this.pos.y + this.size.y > game.height * 2*/) return true;

            // for (let b of game.blocks) if (this.hit(b)) return b;
            let hitblock = false;

            let corners = [[0, 0], [1, 0], [0, 1], [1, 1]];
            for (let i = 0; i < corners.length; i++) {
                let pos = createVector(floor((this.pos.x + corners[i][0] * (this.size.x - 1)) / 8), floor((this.pos.y + corners[i][1] * (this.size.y - 1)) / 8));
                if (game.map[pos.x + pos.y * MW] == 1) hitblock = true;
            }
            if (hitblock) return true;

            return false;
        }

        this.move = () => {
            let steps = floor(abs(this.vel.x) / this.size.x) + 1;
            let sign = this.vel.x / abs(this.vel.x);
            let oldX = this.pos.x;
            for (let x = 0; x < steps; x++) {
                oldX = this.pos.x;
                this.pos.x += this.vel.x / steps;
                if (this.collided()) {
                    this.pos.x = round(oldX);
                    while (!this.collided()) {
                        oldX = this.pos.x;
                        this.pos.x += sign;
                    }
                    jumpDir = -sign;
                    this.wallded = 6;
                    this.pos.x = oldX;
                    this.vel.x *= -this.bounce;
                    break;
                }
            }

            steps = floor(abs(this.vel.y) / this.size.y) + 1;
            sign = this.vel.y / abs(this.vel.y);
            let oldY = this.pos.y;
            for (let y = 0; y < steps; y++) {
                oldY = this.pos.y;
                this.pos.y += this.vel.y / steps;
                let collided = this.collided();
                if (collided) {
                    this.pos.y = round(oldY);
                    while (!this.collided()) {
                        oldY = this.pos.y;
                        this.pos.y += sign;
                    }
                    this.pos.y = oldY;
                    if (this.vel.y > 0) this.grounded = true;
                    this.vel.y *= -this.bounce;
                    if (collided.vel) this.vel.y = collided.vel.y;
                    this.gravityScale = 1;
                    break;
                }
            }
        }

        this.hit = (b) => {
            let x = this.pos.x < b.pos.x + b.size.x && this.pos.x + this.size.x > b.pos.x;
            let y = this.pos.y < b.pos.y + b.size.y && this.pos.y + this.size.y > b.pos.y;
            return x && y;
        }

        this.within = (b) => {
            let x = this.pos.x > b.pos.x && this.pos.x + this.size.x < b.pos.x + b.size.x;
            let y = this.pos.y > b.pos.y && this.pos.y + this.size.y < b.pos.y + b.size.y;
            return x && y;
        }

        this.checkDead = () => {
            if (this.pos.y > 48 * 2) return true;

            let cornersHit = 0;

            let corners = [[0, 0], [1, 0], [0, 1], [1, 1]];
            for (let i = 0; i < corners.length; i++) {
                let pos = createVector(floor((this.pos.x + corners[i][0] * (this.size.x - 1)) / 8), floor((this.pos.y + corners[i][1] * (this.size.y - 1)) / 8));
                if (game.map[pos.x + pos.y * MW] == 2) cornersHit++;
            }
            if (cornersHit == 4) return true;
        }

        let jumpPressed = 0;
        let jumpReleased = 0;
        let dir = false;
        this.dir = false;

        let drag = 0.75;

        let disableDirectionals = false;

        this.update = () => {
            this.dir = dir; // quick fix

            if (this.dead) return this.pos.add(this.vel.add(0, 0.15));

            if (this.vel.y > 2) this.grounded = false;
            if (this.vel.y > 0) this.gravityScale = 2;
            if (this.wallded && this.vel.y > 0) this.gravityScale = 0.7;

            this.vel.add(0, 0.15 * this.gravityScale);

            let acc = 0.4;
            if (btn.left && !disableDirectionals) {
                dir = true;
                this.vel.x -= acc;
            }
            if (btn.right && !disableDirectionals) {
                dir = false;
                this.vel.x += acc;
            }

            if ((btn.left && !pbtn.left) || (btn.right && !pbtn.right)) disableDirectionals = false;
            if (this.grounded) disableDirectionals = false;
            if (((btn.left || btn.right) && !disableDirectionals) || this.grounded) drag = 0.75;
            this.vel.x *= drag;

            let canJump = this.grounded || this.wallded;

            if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) {
                jumpPressed = 4;
                jumpReleased = 0;
            }
            if (canJump && jumpPressed) {
                drag = 0.98;
                let walljump = false;
                if (jumpDir && !this.grounded) {
                    walljump = true;
                    this.vel.x = jumpDir;
                    disableDirectionals = true;
                }
                jumpPressed = 0;
                this.grounded = false;
                this.wallded = 0;
                this.vel.y = walljump ? -1.8 : -2.3;
                this.gravityScale = 1;
            }
            if ((pbtn.a && !btn.a) || (pbtn.b && !btn.b) || (pbtn.up && !btn.up)) jumpReleased = 4;
            if (this.vel.y < 0 && jumpReleased) {
                jumpReleased = 0;
                this.gravityScale = 8;
            }

            if (this.wallded) this.wallded--;
            else jumpDir = 0;
            if (jumpReleased) jumpReleased--;
            if (jumpPressed) jumpPressed--;

            if (this.checkDead()) {
                this.vel.set(0, -2.5);
                this.dead = true;
                curtain = 48;
            } else
                this.move();
        }

        this.draw = () => {
            R.lset(2);
            R.palset(22, 1);

            let f = [8, 8]; // idle

            if (this.grounded && abs(this.vel.x) > 0.5) f = [[0, 0], [0, 8], [8, 0]][floor(frameCount / 2) % 3];
            else if (!this.grounded) {
                if (this.vel.y > 0) f = [8, 0];
                else f = [0, 0];
            }

            if (this.dead) R.spr(f, floor(this.pos.x) - 2 - game.camera.x, floor(this.pos.y) - 3 - game.camera.y, 8, 8, dir, [0, HALF_PI, PI, PI + HALF_PI][floor(frameCount / 8) % 4]);
            else R.spr(f, floor(this.pos.x) - 2 - game.camera.x, floor(this.pos.y) - 3 - game.camera.y, 8, 8, dir);

            // R.palset(5);
            // R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    // --- game map ---

    this.displayMap = () => {
        R.lset(0);
        // let sprs = [104, 108, 112, 116, 120, 124];

        R.palset(22, 1);

        for (let i = 0; i < 8; i++) {
            let t = floor(frameCount / 15) % 4;
            R.spr([t % 2 == 0 ? 120 : 118, 5], i * 8, 48 + 44 - this.camera.y, 8, 2, t == 3, t == 2 ? PI : 0);
        }

        for (let i = 0; i < this.map.length; i++) {
            if (this.map[i] == 1) {
                let spr = getTileSpr(i % MW, floor(i / MW));
                R.spr(spr, i % MW * 8 - this.camera.x, floor(i / MW) * 8 - this.camera.y, 8, 8);
            }

            if (this.map[i] == 2) {
                let t = floor(frameCount / 15 + floor(i / MW) * 8) % 4;
                R.spr([t % 2 == 0 ? 120 : 118, 5], i % MW * 8 - this.camera.x, floor(i / MW) * 8 - this.camera.y + 1, 8, 2, t == 3, t == 2 ? PI : 0);
            }

            if (this.map[i] == 4) R.spr([112, 8], i % MW * 8 - this.camera.x, floor(i / MW) * 8 - this.camera.y, 8, 8, true);
        }

    }

    let getTileSpr = (x, y) => {
        let sprs = [
            [40, 0], [48, 0], [56, 0], [64, 0],
            [40, 8], [48, 8], [56, 8], [64, 8],
            [72, 0], [80, 0], [88, 0], [96, 0],
            [72, 8], [80, 8], [88, 8], [96, 8]
        ]

        let adg = [];
        let coords = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        for (let i = 0; i < 4; i++) adg.push(getTileValue(x + coords[i][0], y + coords[i][1]));

        adg = parseInt(adg.join(''), 2);

        let indexes = [15, 14, 3, 2, 12, 13, 0, 1, 11, 10, 7, 6, 8, 9, 4, 5];

        return sprs[indexes[adg]];
    }

    let getTileValue = (x, y) => {
        if (x < 0 || x >= MW || y < 0 || y >= MH) return 1;
        else return this.map[x + y * MW] == 1 ? 1 : 0;
    }

    // --- map builder ---

    let MW = 16;
    let MH = 12;

    this.newMap = () => {
        if (!this.maps) this.maps = [];
        this.maps.push((new Array(16 * 12)).fill(0));
    }

    this.loadMaps = () => {
        this.maps = getItem('maps');
    }

    this.saveMaps = () => {
        storeItem('maps', this.maps);
    }

    this.mapBuilderUpdate = () => {
        frameCount++;
        this.mapBuilder.update();

        if (btn.start && !pbtn.start) {
            this.saveMaps();
            console.log("map saved");

            this.lastUpdate = this.title;
            this.draw = this.pause;
        }
    }

    function MapBuilder(game) {
        game.loadMaps();
        if (!game.maps) game.newMap();

        this.mapIndex = 0;
        this.map = game.maps[this.mapIndex];

        this.cursor = createVector();
        this.tool = 0;

        this.pcursor = createVector();

        this.savedMap = [];

        this.update = () => {
            R.cls(1);

            let moving = this.updateCursor();
            this.displayCursor(moving);

            // -- sprite drawing --
            // if (btn.a && !pbtn.a) this.tool = (this.map[this.cursor.z] + 1) % 3;
            // if (btn.a) this.map[this.cursor.z] = this.tool;

            if (btn.a && !pbtn.a) {
                if (this.pcursor.equals(this.cursor) || this.map[this.cursor.z] == 0) this.tool = (this.map[this.cursor.z] + 1) % 7;
                else this.tool = 0;
                this.pcursor = this.cursor.copy();
            }
            if (btn.a) this.map[this.cursor.z] = this.tool;

            if (btn.b) {

                if (btn.left && !pbtn.left && this.mapIndex > 0) {
                    if (this.mapIndex == game.maps.length - 1 && !this.map.includes(1)) game.maps.pop();
                    this.map = game.maps[this.mapIndex-- - 1];
                }

                if (btn.right && !pbtn.right) {
                    this.mapIndex++;
                    if (this.mapIndex == game.maps.length) game.newMap();
                    this.map = game.maps[this.mapIndex];
                }

                if (btn.up && !pbtn.up) {
                    this.savedMap = [];
                    for (let i = 0; i < this.map.length; i++) this.savedMap[i] = this.map[i];
                }

                if (btn.down && !pbtn.down && this.savedMap.length) {
                    for (let i = 0; i < this.map.length; i++) this.map[i] = this.savedMap[i];
                }

                R.palset(22, 1);
                R.put(this.mapIndex + "", 2, 2);

            }

            this.displayMap();
        }

        let inputs = [0, 0, 0, 0];
        let pinputs = [0, 0, 0, 0];

        this.updateCursor = () => {
            let delay = 10;

            let pressed = [btn.right && !pbtn.right, btn.left && !pbtn.left, btn.down && !pbtn.down, btn.up && !pbtn.up];
            for (let i = 0; i < 4; i++) if (pressed[i]) inputs[i] = delay;

            for (let i = 0; i < 4; i++) if (inputs[i] > 0) inputs[i]--;

            let down = [btn.right, btn.left, btn.down, btn.up];
            for (let i = 0; i < 4; i++) if (inputs[i] == 0 && down[i]) inputs[i] = 2;

            if (inputs[0] > pinputs[0]) this.cursor.x++;
            if (inputs[1] > pinputs[1]) this.cursor.x--;
            if (inputs[2] > pinputs[2]) this.cursor.y++;
            if (inputs[3] > pinputs[3]) this.cursor.y--;

            if (this.cursor.x < 0) this.cursor.x = MW - 1;
            if (this.cursor.x >= MW) this.cursor.x = 0;
            if (this.cursor.y < 0) this.cursor.y = MH - 1;
            if (this.cursor.y >= MH) this.cursor.y = 0;

            for (let i = 0; i < 4; i++) pinputs[i] = inputs[i];

            let index = this.cursor.x + this.cursor.y * MW;
            let moved = this.cursor.z != index;
            this.cursor.z = index;

            return moved;
        }

        this.displayCursor = (moving) => {
            R.lset(9);

            R.palset(22);

            if (moving || frameCount % 8 >= 4)
                R.spr([104, 4], this.cursor.x * 4, this.cursor.y * 4, 4, 4);
        }

        this.displayMap = () => {
            R.lset(0);
            // let sprs = [104, 108, 112, 116, 120, 124];

            R.palset(22);

            for (let i = 0; i < this.map.length; i++) {

                let tiles = [[104, 0], [108, 0], [108, 4], [112, 0], [116, 0], [120, 0], [124, 0]];
                // if (frameCount % this.map.length == i)
                let spr = tiles[this.map[i]];
                if (this.map[i] == 1) spr = getTileSpr(i % MW, floor(i / MW));

                R.spr(spr, i % MW * 4, floor(i / MW) * 4, 4, 4);
            }

        }

        let getTileSpr = (x, y) => {
            let sprs = [
                [128, 0], [132, 0], [136, 0], [140, 0],
                [128, 4], [132, 4], [136, 4], [140, 4],
                [128, 8], [132, 8], [136, 8], [140, 8],
                [128, 12], [132, 12], [136, 12], [140, 12]
            ]

            let adg = [];
            let coords = [[0, -1], [1, 0], [0, 1], [-1, 0]];
            for (let i = 0; i < 4; i++) adg.push(getTileValue(x + coords[i][0], y + coords[i][1]));

            // console.log(adg);

            adg = parseInt(adg.join(''), 2);

            let indexes = [15, 14, 3, 2, 12, 13, 0, 1, 11, 10, 7, 6, 8, 9, 4, 5];

            return sprs[indexes[adg]];
        }

        let getTileValue = (x, y) => {
            if (x < 0 || x >= MW || y < 0 || y >= MH) return 1;
            else return this.map[x + y * MW] == 1 ? 1 : 0;
        }
    }

});

function printMapData() {
    console.log(getItem("maps"));
}

function clearMapData() {
    storeItem("maps", []);
}