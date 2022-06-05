// ---- SAMS CARTS ----

// // ---- camera, just for fun ----

// createGame(function (RR) {

//     let capture = createCapture(VIDEO);
//     capture.size(64, 48);
//     capture.hide();

//     this.draw = () => {
//         RR.cls(1);
//         RR.lset(0);

//         let displayLayer = RR.buffer[RR.currentLayer];
//         // displayLayer.push();
//         // displayLayer.translate(64, 0);
//         // displayLayer.scale(-1, 1);
//         displayLayer.image(capture, 0, 0);
//         // displayLayer.pop();
//     }
// });

// // ---- wtf ----

// createGame(function (RR) {
//     this.meta = true;
//     this.draw = () => {
//         RR.cls(1);
//         RR.lset(0);
//         let displayLayer = RR.buffer[RR.currentLayer];
//         R.display(0, 0, displayLayer, this.height * 1.66, this.height);
//     }
// });

// ---- flapp catt, a flappy bird clone ----

var flappCattSpr = "%2@!2@!2@%3@!2@!2@%!a@!4@3!@%@c%2@p%N2@!@!2@!@%2@!@!2@!@%!3@!@4!@!3@!@2!@3!a@4!6@!8@!7@2%L2@!@6!@2!@6!@!4@5!@!4@3!@2!@7!@2!@2!@6!@8!@7!@2%K2!2@2!@!@!2@!@2!@!@!@!3@!@4!@!3@!@2!@2!@7!@2!@!@8!@8!@7!@%K2!@3!@!@2!@!@2!@!@!@2!8@2!4@3!@2!@7!@2!@!@8!@8!@7!@%K2@!@6!@2!@6!@2!3@!@2!@2!3@!@2!@2!@3!4@3!@!@3!2@3!@3!2@3!@2!2@3!@%L2@!6@%@!@!4@!@2!4@3!@2!4@3!@2!@3!4@3!@!@3!2@3!@3!2@3!@2!2@3!@%M2@6%3@!2@2!2@%@!3@!@2!@2!3@!@2!@2!@7!@2!@!@8!@8!@7!@%K2@t%@!4@3!@2!@7!@2!@!@8!@8!@7!@%K2@!6@2!4@2!6@!6@%@!3@!@2!@2!@7!@2!@!@8!@7!@7!@2%K2@!6@!6@!6@!6@%@!4@3!@2!@3!4@3!3@3!2@3!@2!5@3!5@2%L2@!2@5!2@2!2@3!2@5!2@3%@!8@2!@3!@2!@6!@2!2@3!@2!@3!@3!@5%M2@!2@%3@!6@%@!2@%3@!2@%3!4@5!@!@3!@2!@6!@2!2@3!@2!@%@!@3!@%Q2@!2@5!6@%@!2@%3@!2@%3!3@!@4!@!@3!@2!@6!@2!2@3!@2!@%@!@3!@%Q2@!6@!2@2!2@%@!2@%3@!2@%3!4@5!@2!3@4!6@!2@2!6@%3@!3@%R2@!6@!2@2!2@%@!2@%3@!2@%3!a%@5%2@7%@2%2@6%5@3%S2"

createGame(function (R) {
    R.setSpriteSheet("flappCattSpr");

    R.palset(22, 1);

    this.bird;
    this.pipes;

    this.score = 0;

    let frameCount = 0;

    let tic = 60;
    let newGame = () => {
        // reset variables
        this.pipes = [];
        this.bird = new Bird(this, 22, 36);
        tic = 60;
        this.score = 0;

        this.draw = this.game;
    }

    this.pause = () => {
        R.lset(9);

        R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4, 22);

        if (btn.start && !pbtn.start) this.draw = this.game;
        if (btn.up && !pbtn.up) this.draw = this.game;
        if (btn.b && !pbtn.b) this.draw = this.game;
    }

    this.onUnfocus = () => { if (this.draw == this.game) this.draw = this.pause; }

    this.title = () => {
        frameCount++;
        R.cls(1);
        R.palset(22, 1);

        // display title image
        R.spr([40, 0], this.width / 2 - 21, this.width / 2 - 24, 42, 16, btn.a);
        R.spr([0, 8], this.width / 2 - 8, this.width / 2 - 11, 29, 8, btn.a);

        let t = 3 * sin(frameCount / 8);
        let f = [0, 0];
        if (sin(frameCount / 4) > 0) f = [10, 0];

        R.spr(f, 22 - 5, 36 + -abs(t), 10, 8);

        let s = this.score + "";
        if (s.length == 1) s = "0" + s;
        R.put(s, 38 - 8, 35, 22);

        if (btn.up && !pbtn.up) newGame();
        if (btn.b && !pbtn.b) newGame();
    }
    this.draw = this.title;

    this.game = () => {
        frameCount++;
        R.cls(1);

        this.bird.update();
        for (let p = this.pipes.length - 1; p >= 0; p--) this.pipes[p].draw();
        this.bird.draw();

        let s = this.score + "";
        if (s.length == 1) s = "0" + s;

        if (!this.bird.dead || !(frameCount % 6 >= 3)) R.put(s, 32, 20, 22);

        tic += (this.score) / 32 + 0.5;

        if (tic >= 30) {
            new Pipe(this, this.width, 32, 40, 16, 24);
            tic = 0;
        }

        if (btn.start && !pbtn.start) this.draw = this.pause;
    }

    function Pipe(game, x, y1, y2, g1, g2) {
        game.pipes.push(this);
        this.pos = createVector(x, round(random(y1, y2)));
        this.gap = round(random(g1, g2));

        let passed = false;

        this.draw = () => {
            if (!game.bird.dead) this.pos.x -= (game.score) / 32 + 0.5;

            R.palset(22, 1);
            R.spr([20, 0], floor(this.pos.x - 1), floor(this.pos.y), 10, 8);
            for (let i = 1; i <= 2; i++)  R.spr([30, 0], floor(this.pos.x - 1), floor(this.pos.y) + i * 8, 10, 8);

            for (let i = 1; i <= 2; i++)  R.spr([30, 0], floor(this.pos.x - 1), floor(this.pos.y) - this.gap - i * 8, 10, 8);
            R.spr([30, 8], floor(this.pos.x - 1), floor(this.pos.y) - 8 - this.gap, 10, 8);

            if (!game.bird.dead && !passed && this.pos.x + 8 < game.bird.pos.x) {
                passed = true;
                game.score += 1;
            }

            if (!game.bird.dead && this.hit(game.bird)) game.bird.die();

            if (this.pos.x < -10) this.kill();
        }

        this.hit = (b) => {
            let x = b.pos.x + b.size.x > this.pos.x && b.pos.x < this.pos.x + 8;
            let by = b.pos.y + b.size.y > this.pos.y;
            let bottom = x && by;
            let ty = b.pos.y < this.pos.y - this.gap;
            let top = x && ty;

            return top || bottom;
        }

        this.kill = () => game.pipes.splice(game.pipes.indexOf(this), 1);
    }

    function Bird(game, x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, -3);
        this.size = createVector(4, 4);

        let rotation = 0;

        this.update = () => {
            let GRAV = 0.2;
            this.vel.y += GRAV;
            this.pos.add(this.vel);

            if (!this.dead && btn.b && !pbtn.b) this.vel.y = -2;
            if (!this.dead && btn.up && !pbtn.up) this.vel.y = -2;

            if (!this.dead && this.pos.y >= 48) this.die();
            else if (this.pos.y > 100 && this.vel.y > 0) game.draw = game.title;
        }

        this.draw = () => {
            if (this.dead) rotation += 0.1;

            R.palset(22, 1);

            let f = [0, 0];
            if (this.vel.y < 0) f = [10, 0];
            R.spr(f, this.pos.x - 5, this.pos.y - 4, 10, 8, false, rotation);
        }

        this.die = () => {
            this.dead = true;
            this.vel.y = -3;
            if (this.pos.y < 24) this.vel.y = -1;
            this.vel.x = random(-0.5, 0.5);
        }
    }
});

// ---- cattout, a breakout/brick breaker clone ----

var cattoutSpr = "^2%5^3%6^%5^5%5^j!^2!^a3%5^5%5^%5^5%5^6%5^7!3@!@^93%5^5%5^%5^5%5^6%5^3!^2%2!@!@!@^Q3!^3%!2@!3@^73%5^5%5^%5^5%3@2^6%5^2!2^3!2%!@3!^73%5^5%5^%5^5%2@3!^5%5^!2^a@3^73!5^2!4^2!6^!5^2!4^!^8!3^5@3^@!@!@^53!6^!6^!6^!6^2!2^2!^!^5!3^5@!3@2!3@^53@2%5@2%2@2%^2@2%5@2%5^2!^2!%@%2@!3^6@3^@!3@^53!2^5!2^2!2^3!2^5!2^9!^!7^c@3^63!2^5!6^3!2^5!2^q@2^3@^73!2@4%@4!2^3!2%@3%@2%2^2!4^2%@4!8^2@!2@^@!@^73!5^!2^2!2^3!2^!3^!2^3!4^2!f@!3@2!3@^j3!^4!3^6!4^2!f@!2@^2@!@^93!d^2!5^5!4^3!c^3@2^4@^93!e^2!5^5!5^v3"

createGame(function (R) {
    R.setSpriteSheet("cattoutSpr"); // set sprite sheet

    this.bricks = [];
    this.balls = [];
    this.pups = [];
    this.paddle;
    this.lives = 3;
    this.score = 0;
    this.level = 0;

    this.comboMulti = 0;
    let levelPoints = 100;
    let brickPoints = 10;

    let frameCount = 0;

    let levels = [
        ["0,0", "2,0", "4,0", "1,2", "3,2"],
        ["2,0", "1,2", "3,2"],
        ["0,0", "4,0", "1,1", "3,1", "0,3", "2,3", "4,3"],
        ["1,1", "2,1", "2,3", "4,0", "4,3", "1,3"]
    ]

    // starts the game
    let newGame = () => {
        // reset variables here
        this.level = -1;
        this.lives = 3;
        this.score = -levelPoints;
        this.draw = this.nextLevel; // make draw loop the game loop
    }

    let loadLevel = () => {
        this.bricks = [];
        blanks = levels[this.level % levels.length];
        for (let y = 0; y < 4; y++) for (let x = 0; x < 5; x++) if (!blanks.includes(x + "," + y)) new Brick(this, 7 + x * 10, 6 + y * 6);
    }

    // pause screen
    this.pause = () => {
        R.lset(9);

        R.put("pause", this.width / 2 - 4 * 5 - 1, this.height / 2 - 4, 1);
        R.put("pause", this.width / 2 - 4 * 5 + 1, this.height / 2 - 4, 1);
        R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4 - 1, 1);
        R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4 + 1, 1);

        R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4, 22);

        if (btn.start && !pbtn.start) this.draw = this.game;
        if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) this.draw = this.game;
    }

    // triggers when unfocusing the game boy
    this.onUnfocus = () => {
        // pauses when not on title screen
        if (this.draw == this.game) this.draw = this.pause;
    }

    // title screen
    this.title = () => {
        frameCount++;
        R.cls(1);

        let pos = createVector(this.width / 2 - 24, 3);
        R.palset(22, 22, 64);
        R.spr([0, 0], pos.x, pos.y, 49, 16);
        R.palset(64, 22, 22);
        R.spr([0, 0], pos.x, pos.y + 16, 49, 16);

        let s = floor(this.score) + "";
        while (s.length < 5) s = "0" + s;
        R.put(s, 32 - s.length * 4, 35, 22);

        if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) newGame();
    }
    this.draw = this.title; // make draw the titlescreen

    let timer = 0;
    this.nextLevel = () => {
        R.cls(1);
        let s = "level " + (this.level + 2);
        R.put(s, 32 - s.length * 4, 24 - 9, 22);

        s = floor(this.score + levelPoints * (this.level + 2)) + "";
        while (s.length < 5) s = "0" + s;
        R.put(s, 32 - s.length * 4, 25, 22);

        if (timer++ == 30) {
            timer = 0;
            this.paddle = new Paddle(this, this.width / 2 - 4, 40);
            this.balls = [];
            this.pups = [];
            if (this.lives < 3) this.lives++;
            this.level++;
            this.score += levelPoints * (this.level + 1);
            loadLevel();
            this.draw = this.game;
        }
    }

    // game loop
    this.game = () => {
        frameCount++;
        R.cls(1);

        this.paddle.update();
        for (let b = this.balls.length - 1; b >= 0; b--) this.balls[b].update();

        this.paddle.draw();
        for (let b of this.balls) b.draw();
        for (let b of this.bricks) b.draw();
        for (let p of this.pups) p.draw();

        for (let i = 0; i < this.lives; i++) {
            R.palset(64, 22, 64);
            R.spr([52, 1], 1 + 6 * i, 43, 5, 4);
        }

        if (!this.bricks.length) {
            timer = 0;
            this.draw = this.nextLevel;
        }

        if (this.lives <= 0 && !this.balls.length && !this.paddle.balls) {
            this.draw = this.title;
        }

        if (btn.start && !pbtn.start) this.draw = this.pause;
    }

    function Power(game, x, y) {
        game.pups.push(this);

        this.size = createVector(3, 3);
        this.pos = createVector(x - this.size.x / 2, y - this.size.y / 2);

        let pups = ['life', 'long', 'mult', 'smol'];
        let sprs = [[54, 5], [54, 10], [49, 10], [49, 5]];

        this.type = pups[random([0, 1, 1, 2, 2, 3])];

        this.hit = (b) => {
            let x = this.pos.x < b.pos.x + b.size.x && this.pos.x + this.size.x > b.pos.x;
            let y = this.pos.y < b.pos.y + b.size.y && this.pos.y + this.size.y > b.pos.y;
            return x && y;
        }

        this.draw = () => {
            this.pos.y += 0.5;

            if (this.hit(game.paddle)) {
                game.pups.splice(game.pups.indexOf(this), 1);
                if (this.type == 'mult') {
                    let l = game.balls.length;
                    for (let b = 0; b < l; b++) new Ball(game, game.balls[b].vel.x * -1, game.balls[b].pos.x, game.balls[b].pos.y);
                } else if (this.type == 'life') game.lives++;
                else if (this.type == 'long') {
                    game.paddle.size.x += 4;
                    game.paddle.pos.x -= 2;
                } else if (this.type == 'smol' && game.paddle.size.x > 4) {
                    game.paddle.size.x -= 4;
                    game.paddle.pos.x += 2;
                }
            }

            R.palset(22, 1, 64);
            R.spr(sprs[pups.indexOf(this.type)], round(this.pos.x - 1), round(this.pos.y - 1), 5, 5);
        }
    }

    function Ball(game, dir, x, y) {
        game.balls.push(this);

        this.vel = createVector(dir, -1);
        this.size = createVector(2, 2);
        this.pos = createVector(x - this.size.x / 2, y - this.size.y);

        this.bounce = 1;

        this.update = () => {
            this.move();

            if (this.pos.y > game.height) {
                if (game.balls.length == 1) game.lives--;
                if (game.lives >= 0 && !game.paddle.balls && game.balls.length == 1) {
                    game.paddle.balls++;
                    game.paddle = new Paddle(game, game.paddle.pos.x, game.paddle.pos.y);
                }

                game.balls.splice(game.balls.indexOf(this), 1);
            }

            if (this.hit(game.paddle)) {
                game.comboMulti = 0;
                this.vel.y = -abs(this.vel.y);
            }
        }

        this.collided = () => {
            if (this.pos.x < 0) return true;
            if (this.pos.x + this.size.x > game.width) return true;
            if (this.pos.y < 0) return true;
            // if (this.hit(game.paddle)) {
            //     game.comboMulti = 0;
            //     return true;
            // }
            for (let b of game.bricks) if (this.hit(b)) {
                b.wasHit = true;
                return true;
            }

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
                if (this.collided()) {
                    this.pos.y = round(oldY);
                    while (!this.collided()) {
                        oldY = this.pos.y;
                        this.pos.y += sign;
                    }
                    this.pos.y = oldY;
                    this.vel.y *= -this.bounce;
                    break;
                }
            }
        }

        this.draw = () => {
            R.palset(22, 22);
            R.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        this.hit = (b) => {
            let x = this.pos.x < b.pos.x + b.size.x && this.pos.x + this.size.x > b.pos.x;
            let y = this.pos.y < b.pos.y + b.size.y && this.pos.y + this.size.y > b.pos.y;
            return x && y;
        }

        this.kill = () => {
            game.ball = false;
        }
    }

    function Paddle(game, x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.size = createVector(8, 2);

        this.balls = 1;

        this.update = () => {
            this.pos.add(this.vel);
            this.vel.x *= 0.8;

            let acc = 0.5;
            if (btn.left) this.vel.x -= acc;
            if (btn.right) this.vel.x += acc;

            if (this.pos.x < 0) {
                this.pos.x = 0;
                this.vel.x = 0;
            }
            if (this.pos.x + this.size.x > game.width) {
                this.pos.x = game.width - this.size.x;
                this.vel.x = 0;
            }

            if (this.balls) {
                let dir = -1;
                if (this.vel.x > 0) dir = 1;

                if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) {
                    this.balls--;
                    new Ball(game, dir, this.pos.x + this.size.x / 2, this.pos.y);
                }
            }
        }

        this.draw = () => {
            R.palset(22, 22);
            R.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

            if (this.balls) {
                R.palset(64, 64, 22);
                R.spr([49, 2], this.pos.x, this.pos.y - 4, 8, 3, this.vel.x > 0);
            }
        }
    }

    function Brick(game, x, y) {
        game.bricks.push(this);
        this.pos = createVector(x, y);
        this.size = createVector(8, 4);
        this.wasHit = false;

        let look = random([-2, -1, 0, 1, 2]);;
        let blink = 0;

        this.draw = () => {
            R.palset(22, 22, 22);
            R.spr([49, 0], this.pos.x, this.pos.y - 1, 8, 5);

            R.palset(0);
            let left = look;
            let right = look;
            if (left == -2) left = -1;
            if (right == 2) right = 1;

            if (blink == 0) {
                R.fillRect(this.pos.x + 2 + left, this.pos.y + 1, 1, 2);
                R.fillRect(this.pos.x + this.size.x - 3 + right, this.pos.y + 1, 1, 2);
            } else {
                blink--;
                look = random([-2, -1, 0, 1, 2]);
            }

            if (random() < 0.002) blink = 4;

            if (this.wasHit) this.kill();
        }

        this.kill = () => {
            game.bricks.splice(game.bricks.indexOf(this), 1);
            game.comboMulti++;
            game.score += brickPoints * game.comboMulti;

            if (random() < 0.1) new Power(game, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
        }
    }

});

// ---- untitled platforming game, origional game ----

var catPlatSpr = "^3!^!^5!^!^4!4^4!4^3!6^%!6@!3@^3!3@!3^4!6^!6^P2!@!@!^3!@!@!^2!@4!^2!2@3!^!@6!@^6%^3%!^!^3%^3!^2@^6@^6@^O2!@3!^3!@3!^!@6!3@5!^!@4!^@^6%^3%^!^4%2^3!%@^6@^6@^N2!@4!^2!@4!^!@2!2@2!3@2!@2!^2!@2!^2@^6%^3%!^5%^%^2%!@^6@^6@^N2!@4!^2!@4!^!@2!2@2!3@2!@2!^3!2^3@^6%^3!%^4%^3%2^2@^6@^6@^N2!@4!^2!@4!^!@6!3@5!^8@^6%^3!^%^2%^8@^6@^6@^N2!@2!2^4!2@2!^2!@4!^2!2@3!^9@^6%^3!^2%2^9@^6@%^4%!^O2!2^8!2^4!4^4!4^a@^6@!4^6!^6@^6@^%^2%^!^P2!^!^5!^!^4!4^5!2^6!2^3!%^4%^4!^6!^6%^6%^2%2^R2!@!@!^3!@!@!^2!3@!2^3!2@!^5!2^3!^%^2%^5!^6!^5!@!3^2!@!2^2!6^!6^E2!@3!^3!@3!^2!2@3!^3!2@!^5!2^3!^2%2^6!^b!3@!2^!@!4^!6^!6^D2!@4!^2!@4!^2!2@!@!^3!4^5!2^3!^a!^b!2^2%^2@!^2!2^3!2^5!2^E2!@6!^!@4!^2!2@!@!^3!4^5!2^3!^a!^b!2^3%2!2^2!2^3!2^5!2^E2!@6!^!@4!^2!2@3!^3!2@!^5!2^3!^a!^b!2^5!6^3!2^5!2^F2!6^2!@4!^2!3@!2^3!2@!^5!2^3!^6!5^b!6^!6^3!2^5!2^O2!4^4!4^5!2^6!2^3!^6!^3!^6!^5!5^!2^2!2^3!2^5!2^E2"

createGame(function (R) {
    R.setSpriteSheet("catPlatSpr"); // set sprite sheet

    // game variables here
    this.cat;
    this.blocks = [];
    this.coins = [];
    let curtainY = 0;

    this.score = 0;

    let frameCount = 0;

    // starts the game
    let newGame = () => {
        // reset game variables here
        this.blocks = [];
        this.coins = [];
        this.cat = new Cat(this, 26, 24);

        this.score = 0;
        curtainY = 0;

        let startBlock = new Block(this, 24, 32, true);
        startBlock.push();

        this.draw = this.game; // make draw loop the game loop
    }

    // pause screen
    this.pause = () => {
        // we don't clear the screen here so that the pause text goes over top of the paused game;
        R.lset(9); // set layer to highest

        R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4, 22);

        if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) this.draw = this.game; // if button pressed go to game loop
    }

    this.onUnfocus = () => { // this function runs when unfocusing the game boy
        // pauses when game is running
        if (this.draw == this.game) this.draw = this.pause;
    }

    // title screen
    this.title = () => {
        frameCount++;
        R.cls(1); // clear screen to black

        R.palset(22, 22);
        R.spr([40, 0], 32 - 25, 4, 50, 16);
        R.palset(64, 22, 22);
        R.spr([40, 0], 32 - 25, 20, 50, 16);

        R.palset(22, 1);
        let f = [[16, 0], [24, 0], [16, 8], [24, 8], [32, 8], [24, 8], [16, 8], [24, 0], [16, 0]][floor(frameCount / 4) % 8];
        R.spr(f, 19, 34, 8, 8, floor(frameCount / 4) % 8 > 4);

        let s = this.score + "";
        if (s.length == 1) s = "0" + s;
        R.put(s, 38 - 9, 35, 22);

        if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) newGame(); // if button pressed start new game

        if (curtainY > 0) {
            curtainY -= 2;

            R.palset(1);
            R.fillRect(0, 48 - curtainY, 64, 48);
        }
    }
    this.draw = this.title; // make draw loop the titlescreen

    // game loop
    this.game = () => {
        frameCount++;
        R.cls(1); // clear screen to black
        R.palset(22, 1); // set to basic palette

        // if (btn.a && !pbtn.a) new Block(this, random([0, 8, 16, 24, 32, 40, 48, 56]));
        if (random() < 0.06 && this.blocks.length < 8) {
            let xpos = [0, 8, 16, 24, 32, 40, 48, 56];
            for (let b of this.blocks) if (b.pos.y < 24) xpos.splice(xpos.indexOf(b.pos.x), 1);

            let x = floor(this.cat.pos.x / 8) * 8;
            xpos.splice(xpos.indexOf(x), 1);

            if (xpos.length) {
                let y = 0;
                if (this.blocks.length) y = this.blocks[0].pos.y % 1;
                let b = new Block(this, random(xpos), y);
                if (random() < 0.33) new Coin(this, b.pos.x + 2, b.pos.y - 7);
                b.push();
            }
        }

        this.cat.update();
        for (let i = this.blocks.length - 1; i >= 0; i--) this.blocks[i].update();
        for (let i = this.coins.length - 1; i >= 0; i--) this.coins[i].update();

        for (let i = this.blocks.length - 1; i >= 0; i--) this.blocks[i].draw();
        for (let i = this.coins.length - 1; i >= 0; i--) this.coins[i].draw();
        this.cat.draw();

        if (this.cat.dead && this.cat.pos.y > 48 + 16 && this.cat.vel.y > 0) {
            if (curtainY > 48) this.draw = this.title;
            curtainY += 2;

            R.palset(1);
            R.fillRect(0, 0, 64, curtainY);
        }

        if (btn.start && !pbtn.start) this.draw = this.pause; // if start button pressed, go to pause screen
    }

    function Coin(game, x, y) {
        game.coins.push(this);
        this.size = createVector(4, 4);
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0.5);

        this.update = () => {
            if (!game.cat.dead) this.pos.add(this.vel);
            if (this.pos.y > 48 + 16) game.coins.splice(game.coins.indexOf(this), 1);

            if (!game.cat.dead && game.cat.hit(this)) this.collect();
        }

        this.draw = () => {
            R.palset(22, 1);
            let f = [[16, 0], [24, 0], [16, 8], [24, 8], [32, 8], [24, 8], [16, 8], [24, 0], [16, 0]][floor(frameCount / 4) % 8];
            R.spr(f, floor(this.pos.x) - 2, floor(this.pos.y) - 2, 8, 8, floor(frameCount / 4) % 8 > 4);

            // R.palset(5);
            // R.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        this.collect = () => {
            game.coins.splice(game.coins.indexOf(this), 1);
            game.score++;
        }
    }

    function Block(game, x, y, starter) {

        this.size = createVector(8, random([8, 12, 16, 20, 24, 28, 32]));

        this.pos = createVector(x, y - this.size.y - 4);
        if (starter) this.pos.y = y;
        this.vel = createVector(0, 0.5);
        if (starter) this.vel.y = 0.1;

        this.push = () => {
            game.blocks.push(this);
        }

        this.update = () => {
            // this.vel.add(0, 0.01);

            // if (this.vel.y > 2) this.vel.y = 2;

            if (!game.cat.dead) {
                this.pos.add(this.vel);
                if (game.cat.hit(this)) game.cat.pos.y += this.vel.y;
            }

            if (this.pos.y > 48 + 16) game.blocks.splice(game.blocks.indexOf(this), 1);
        }

        this.draw = () => {

            R.palset(22, 1);

            let pos = createVector(floor(this.pos.x), floor(this.pos.y));

            R.spr([32, 0], pos.x, pos.y, 8, 2);
            R.spr([32, 1], pos.x, pos.y + 2, 8, 1, false, 0, 8, this.size.y - 2);
            R.spr([32, 2], pos.x, pos.y + this.size.y, 8, 3);

            // R.palset(5);
            // R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    function Cat(game, x, y) {
        this.size = createVector(4, 4);
        this.pos = createVector(x - this.size.x / 2, y - this.size.y / 2);
        this.vel = createVector();
        this.bounce = 0;
        this.gravityScale = 1;
        this.grounded = false;
        this.wallded = false;
        let jumpDir = 0;

        this.collided = () => {
            if (this.pos.x < 0 || this.pos.x + this.size.x > game.width) return true;
            if (this.pos.y < 0 /*|| this.pos.y + this.size.y > game.height*/) return true;

            for (let b of game.blocks) if (this.hit(b)) return b;

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

        let jumpPressed = 0;
        let jumpReleased = 0;
        let dir = false;

        this.update = () => {

            if (this.dead) return this.pos.add(this.vel.add(0, 0.15));

            if (this.vel.y > 2) this.grounded = false;
            if (this.vel.y > 0) this.gravityScale = 2;
            if (this.wallded && this.vel.y > 0) this.gravityScale = 0.5;

            this.vel.add(0, 0.15 * this.gravityScale);

            let acc = 0.6;
            if (btn.left) {
                dir = true;
                this.vel.x -= acc;
            }
            if (btn.right) {
                dir = false;
                this.vel.x += acc;
            }

            this.vel.x *= 0.80;

            let canJump = this.grounded || this.wallded;

            if ((btn.a && !pbtn.a) || (btn.b && !pbtn.b) || (btn.up && !pbtn.up)) {
                jumpPressed = 4;
                jumpReleased = 0;
            }
            if (canJump && jumpPressed) {
                if (jumpDir && !this.grounded) this.vel.x = jumpDir * 2;
                jumpPressed = 0;
                this.grounded = false;
                this.wallded = 0;
                this.vel.y = -2;
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

            if (this.pos.y > 48 + 16) {
                this.vel.set(0, -3.5);
                this.dead = true;
                curtain = 48;
            } else this.move();
        }

        this.draw = () => {
            R.palset(22, 1);

            let f = [8, 8]; // idle

            if (this.grounded && abs(this.vel.x) > 0.5) f = [[0, 0], [0, 8], [8, 0]][floor(frameCount / 2) % 3];
            else if (!this.grounded) {
                if (this.vel.y > 0) f = [8, 0];
                else f = [0, 0];
            }

            if (this.dead) R.spr(f, floor(this.pos.x) - 2, floor(this.pos.y) - 3, 8, 8, dir, [0, HALF_PI, PI, PI + HALF_PI][floor(frameCount / 8) % 4]);
            else R.spr(f, floor(this.pos.x) - 2, floor(this.pos.y) - 3, 8, 8, dir);

            // R.palset(5);
            // R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    // new classes go here

});

// ---- car game, origional game ----

// var carspr = "%3@7%D@j%2@3%@3%3!8%r!2%8!%22@4!5@3%B@!h@%@!3@!3@%2@8%8!2%7!3%6!%2!%6!%!%7!2%U1@!@!5@!2@2%6@6%7@7%5@6!h@2!2@2!@2!2@%@8%E2@!2@!4@2!2@%4@3!4@5%@3!5@2%2@3!4@!h@2!2@2!@2!2@%@8%3!5%w2@!2@!4@2!2@%3@2!2@!7@3!2@!5@4!2@!3@!h@%@2%@!@%@2%2@8!3@5%w2@!2@!@3!@!2@%3@!2@2!3@3!@2!2@2!4@!@2!2@2!3@j%4@!@%5@g%w2@2!a@%3@!2@2!3@3!@2!2@2!4@!@2!2@2!3@!h@%4@!@%5@g%3@4%6@4%6@4%7@2%8@2%P1@2!2@4!2@2%3@!2@!@2!@3!@2!2@!@3!@!@2!2@!@2!@!h@%4@!@%5!4@c%2@!4@%4@!4@%4@!4@%5@!2@%6@!2@%P1@4%2@4%4@!b@2!a@2!8@4!8@4!@%4@!@%5@8%9@!@4!@%2@!2@3!@%2@!3@!2@%3@!2@!@%5@!2@%12@2!2@5!2@4!2@4!2@4!2@6!2@a!2@3%4@!@%5@8%8@!@6!@2!2@5!@%@!2@3!@%3@!2@!@%5@!2@%22@4%3@4%2@4%2@4%2@4%4@4%8@4%6@!@%5@8%8@!@2!2@2!@2!2@2!@2!@%@!2@!@!@%3@!4@%5@!2@%V2@!@%5@8%8@!@2!2@2!@2!2@2!@2!@%@!2@!@!@%3@!4@%5@!2@%U2@2!@2%4@8%8@!@6!@2!2@5!@%@!2@3!@%3@!2@!@%5@!2@%U2@!@!@%4@8%9@!@4!@%2@!2@3!@%2@!3@!2@%3@!2@!@%5@!2@%U2@!3@%4!8%a@!4@%4@!4@%4@!4@%5@!2@%6@!2@%V2@3%5@8%b@4%6@4%6@4%7@2%8@2%O1";

// createGame(function (R) {
//     R.setSpriteSheet("carspr"); // set sprite sheet

//     // game variables here
//     let x = 0;

//     // starts the game
//     let newGame = () => {
//         // reset game variables here
//         x = 0;
//         this.draw = this.game; // make draw loop the game loop
//     }

//     // pause screen
//     this.pause = () => {
//         // we don't clear the screen here so that the pause text goes over top of the paused game;
//         R.lset(9); // set layer to highest

//         R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4, 22);

//         if ((btn.start && !pbtn.start) || (btn.b && !pbtn.b)) this.draw = this.game; // if button pressed go to game loop
//     }

//     this.onUnfocus = () => { // this function runs when unfocusing the game boy
//         // pauses when game is running
//         if (this.draw == this.game) this.draw = this.pause;
//     }

//     // title screen
//     this.title = () => {
//         R.cls(1); // clear screen to black
//         R.palset(22, 1); // set to basic palette

//         // put title sprite here

//         if (btn.b && !pbtn.b) newGame(); // if button pressed start new game
//     }
//     this.draw = this.title; // make draw loop the titlescreen

//     // game loop
//     this.game = () => {
//         R.cls(1); // clear screen to black
//         R.palset(22, 1); // set to basic palette

//         // game logic and draw calls goes here

//         drawRoad(x += 0.5);

//         if (btn.start && !pbtn.start) this.draw = this.pause; // if start button pressed, go to pause screen
//     }

//     let drawRoad = (X) => {
//         let x = X % 8;
//         let x2 = X / 2 % 8;

//         for (let i = 0; i < 9; i++) {
//             R.spr([80, 0], -x + i * 8, 48 - 15, 8, 16);
//             R.spr([80, 0], -x + i * 8, 48 - 31, 8, 16);

//             R.spr([88, 0], -x2 + i * 8, 9, 8, 8);
//         }
//     }

//     // new classes go here



//     function Player(game) {
//         this.pos = createVector();
//         this.vel = createVector();

//         this.draw = () => {

//         }

//         this.update = () => {

//         }
//     }

// });

var jumpCat = "%R@!@%@!@%9@!@%@!@%5!%3!6%!3%!3%2!4%!4%2!7%2!4%2!d%!3%!4%!2%s2@!3@!3@%7@!3@!3@%3!%3!%6!%3!%3!2%4!%4!2%7!%!4%!e%!3%!4%!3%d@%3@%H1@%3@%p@!7@%7@!7@%3!%3!%6!%3!%3!%b!%7!%!2%3!2%!2%2!2%2!2%2!2%!6%!2%c@!@%@!@%q1@%3@%a@!@%@!@%o@!2@!2@!@%7@!2@!2@!@%3!%4!3%3!%3!%3!%b!%3!%3!%!2%3!5%2!2%2!2%4!8%d@!3@!3@%o1@!@%@!@%8@!3@!3@%n@!2@!2@!@%7@!2@!2@!@%3!%6!%3!%3!%3!%3!%3!%3!%3!%3!%!7%!2%2!2%2!2%4!3%2!3%d@!7@%n1@!3@!3@%7@!7@%9@%3@%a@!5@%9@!5@%4!%6!%3!%3!%3!%3!%f!%!7%!2%2!2%2!2%3!4%2!4%c@!7@%n1@!7@%7@!2@!2@!@%8@!@%@!@%a@5%6@3%2@5%5!%3!2%!%3!%3!%3!%3!%4!%3!%6!%G@3!@2!@2!@3%l1@!2@!2@!@%7@!2@!2@!@%7@!3@!3@%8@5%6@!3@6%@3%2!%2!%2!2%3!%3!%3!%3!%3!3%!3%!4%G@!3@!5@!3@%k1@!2@!2@!@%8@!5@%8@!7@%3@3%@!5@4%2@!3@!5@!3@%4!%7!%7!%3!%3!7%!%J@!3@7!3@%h1@3%@!5@%6@3%@8%2@3%@!2@!2@!@4!3@!6@!3@%@!2@!6@!3@%4!%7!%7!%3!%3!2%!2%!%!%J@!2@!7@!2@%g1@!3@a%3@!3@!4@!3@%!3@2!2@!2@!@!6@!6@!3@%2@3!6@2!2@%5!%5!%!%5!2%3!%3!2%!2%!%!%K@2%@!5@%@2%h1@!3@!5@!3@%2@!3@!4@!3@%!3@!@!5@2!5@2!6@2!2@%4@!6@%@2%7!5%3!5%2!3%!%3!5%O@2!6@2%j1@!2@!6@!3@%2@!2@!6@!2@%!2@!3@5!2@!2@3!6@%2@2%6@!3@!2@2%l1@!a@%j1@2!8@!2@%3@2!8@2%2@3!a@3%@!4@!2@%a@!4@!3@%H@!@2!@4%w@!4@2!4@%k1@!4@!4@2%5@!3@2!3@%6@!3@2!3@%4@!3@!3@%b@!3@!3@%H!@4!2@2%x@!2@%2@!2@%k1@!4@%@!4@%4@!4@2!4@%4@!4@2!4@%4@!2@2!2@%b@!2@2!2@%I!@!@2!2@!%y@2%4@2%k1";

createGame(function (R) {
    R.setSpriteSheet("jumpCat"); // set sprite sheet

    // game variables here
    this.score = 0;
    let scorelerp = 0;

    let guy;
    this.platforms;

    this.camera;

    let frameCount = 0;

    // starts the game
    let newGame = () => {
        // reset game variables here

        this.platforms = [];

        let p = new Platform(20, 40, "be a butterfly", "shark", this);
        this.platforms.push(p);
        this.platforms.push(new Platform(70, 30, "touch boobs", "boobs", this));
        this.newPlatform();
        this.newPlatform();
        this.newPlatform();

        guy = new Guy(20, 48 - 8 - 13, this);
        guy.currentPlatform = p;

        this.score = 0;
        scorelerp = 0;

        this.camera = createVector();

        this.draw = this.game; // make draw loop the game loop
    }

    // pause screen
    this.pause = () => {
        // we don't clear the screen here so that the pause text goes over top of the paused game;
        R.lset(9); // set layer to highest

        R.put("pause", this.width / 2 - 4 * 5, this.height / 2 - 4, 22);

        if ((btn.start && !pbtn.start) || (btn.b && !pbtn.b)) this.draw = this.game; // if button pressed go to game loop
    }

    this.onUnfocus = () => { // this function runs when unfocusing the game boy
        // pauses when game is running
        if (this.draw == this.game) this.draw = this.pause;
    }

    // title screen
    this.title = () => {
        frameCount++;
        R.cls(1); // clear screen to black
        R.palset(22, 1); // set to basic palette

        // put title sprite here

        let x = 31 - 17;
        let y = 8;

        R.spr([83, 0], x, y, 37, 12);
        R.spr([120, 0], x, y + 13, 33, 6);

        if (scorelerp < this.score) scorelerp++;
        let s = scorelerp + "";
        if (s.length < 2) s = "0" + s;

        R.put(s, 33, 48 - 14, 22);

        let frames = [16, 32, 16];

        R.spr([frames[floor(frameCount / 10) % 3], 0], 14, 27, 16, 16);

        if (btn.b && !pbtn.b) newGame(); // if button pressed start new game
    }
    this.draw = this.title; // make draw loop the titlescreen

    // game loop
    this.game = () => {
        frameCount++;
        R.cls(1); // clear screen to black

        let s = this.score + "";
        if (s.length < 2) s = "0" + s;
        R.put(s, 32 - s.length * 4, 2, 22);

        let maxSpeed = 0.50;
        if (!guy.dead) this.camera.x += min(maxSpeed, map(this.score, 0, 80, 0.25, maxSpeed));

        if (guy.getScreenPos().x > 40) this.camera.x += ((guy.pos.x - 40) - this.camera.x) / 8;

        // draw platforms

        guy.update();

        R.palset(22, 1);

        for (let i = this.platforms.length - 1; i >= 0; i--) this.platforms[i].draw();
        guy.draw();

        if (btn.start && !pbtn.start) this.draw = this.pause; // if start button pressed, go to pause screen
    }

    this.newPlatform = () => {
        let x = this.platforms[this.platforms.length - 1].pos.x + this.platforms[this.platforms.length - 1].size.x;
        let distances = [10, 20, 30];

        x += distances[floor(random(distances.length))];

        let widths = [10, 20, 30];
        let w = widths[floor(random(distances.length))];

        this.platforms.push(new Platform(x, w, "", "", this));

    }

    // new classes go here

    function Guy(x, y, game) {
        let grounded = false;
        let squishTimer = 0;

        let GRAV = 0.5;
        let jumpSpeed = -4;

        this.dead = false;

        this.currentPlatform = false;

        this.pos = createVector(x, y);
        this.vel = createVector(getVelocity(10), jumpSpeed);
        this.size = createVector(8, 13);

        let jumpPower = 0;

        this.update = () => {
            this.vel.add(0, GRAV);
            this.pos.add(this.vel);

            let ground = 40;

            if (this.pos.y + this.size.y > ground && !this.dead) {

                this.vel.x = 0;

                let platform = isAbovePlatform();

                if (platform) {
                    this.vel.y = 0;

                    this.pos.y = ground - this.size.y;

                    if (!grounded) {
                        squishTimer = 3;

                        this.pos.x = floor(this.pos.x);

                        if (platform != this.currentPlatform) {
                            game.score++;
                            this.currentPlatform = platform;
                        }
                    }

                    grounded = true;
                }
            }

            if (this.pos.y > 48) {
                if (this.dead && this.vel.y > 0) {
                    //go to title screen
                    if (this.pos.y > 48 + 16) game.draw = game.title;
                } else {
                    this.dead = true;
                    this.vel.set(0, jumpSpeed);
                    GRAV = 0.25;
                }
            }

            if (this.getScreenPos().x + 10 < 0) {
                this.dead = true;
                GRAV = 0.25;
                jumpSpeed *= 0.8;

                this.vel.set(getVelocity(32), jumpSpeed);
            }

            if (grounded && ((!btn.b && pbtn.b) || (!btn.a && pbtn.a))) {
                grounded = false;
                this.vel.y = jumpSpeed;

                let dist = map(jumpPower, 0, 60, 10, 40);
                jumpPower = 0;

                this.vel.x = getVelocity(dist);
            }

            if (grounded && (btn.b || btn.a) && jumpPower < 60) jumpPower++;
        }

        this.draw = () => {

            let frame = 16;

            if ((btn.b || btn.a) && grounded) frame = 32;

            if (!grounded) {
                if (this.vel.y > 0) frame = 64;
                else frame = 48;
            }

            if (squishTimer > 0) {
                squishTimer--;
                frame = 0;
            }

            if (this.dead) frame = 160;

            let offset = 0;
            if (jumpPower > 50) {
                if (frameCount % 4 >= 2) offset = 1;
            }
            R.spr([frame, 0], this.pos.x - 4 - game.camera.x + offset, this.pos.y - 3, 16, 16);
        }

        let isAbovePlatform = () => {

            for (let i = 0; i < game.platforms.length; i++) {
                let platform = game.platforms[i];
                if (this.pos.x + this.size.x > platform.pos.x && platform.pos.x + platform.size.x > this.pos.x) return platform;
            }

            return false;
        }

        this.getScreenPos = () => {
            return this.pos.copy().sub(game.camera);
        }

        function getVelocity(d) {
            return d / ((-2 * jumpSpeed) / GRAV);
        }
    }

    function Platform(x, w, hope, dream, game) {
        this.pos = createVector(x, 48 - 8);
        this.size = createVector(w, 8);

        let hopes = hope;
        let dreams = dream;

        let grass = [];

        let grassXs = [121, 124, 127];
        let ngrass = floor(random(4));
        for (let i = 0; i < ngrass; i++) {
            grass.push(createVector(floor(this.pos.x + 1 + random(this.size.x - 4)), this.pos.y - 3, grassXs[floor(random(grassXs.length))]));
        }

        this.draw = () => {
            R.spr([80, 0], this.pos.x - game.camera.x, this.pos.y + 1, 1, 8);
            R.spr([80, 0], this.pos.x + this.size.x - 1 - game.camera.x, this.pos.y + 1, 1, 8);
            R.spr([81, 0], this.pos.x + 1 - game.camera.x, this.pos.y + 1, 1, 1, false, 0, this.size.x - 2, 1);

            if (this.getScreenPos().x + this.size.x < 0) {
                game.platforms.splice(game.platforms.indexOf(this), 1);
                game.newPlatform();
            }

            for (let g of grass) {
                //println(g);
                R.spr([floor(g.z), 13], g.x - game.camera.x, g.y - game.camera.y, 3, 3);
            }
        }

        this.getScreenPos = () => {
            return this.pos.copy().sub(game.camera);
        }
    }

});