var fireGirl = "%31@3%@d%J!%5!%!%d!%!%5!%!%5!K%b!j%!4%Q!4%!4%!4%2!4%3@!@%@!3@!3@!3@%K!%7!%4!%2!%6!%3!%8!2@7!3@2!3@4!@4!@2!@2!@4!@2!@2!@2!%b!@3!@!@!2@!2@2!2@!3@2!%i!3%u!@4!@4!@4!2@4!%2@!@%@!@3!@4!@2%B!%7!2%2!%!%!%3!%!%!%3!%g!@8!3@2!3@4!@4!@2!@2!@4!@2!@2!@2!%b!2@!2@3!@!@!@!@!@!@!@!2%a!3%6!@!%4!3%6!2%e!@4!@4!@5!@4!%2@!@%@!3@!3@2!@%C!%7!%3!%!%!%3!%o!@2!@2!@2!@2!2@2!2@2!3@2!2@2!@2!@2!3@2!@2!@2!%c!@!2@!@!@3!@!@!@2!3@!%b!@!%5!3%5!@!%4!2@!%5!2%6!@2!4@2!2@2!@2!@2!3%2@!@3!@3!@4!@%g!2%c!%!%5!%!%3!%!%3!%w!@2!@2!@2!@2!2@2!2@2!3@2!2@5!@4!@2!@2!@2!%c!@!2@!@!@!@!@!@!@!@!@2!%b!3%4!5%4!3%5!3%4!2@!%5!@4!2@2!2@5!@4!%2@!3@!3@!@%2@!@%f!2@!%5!2%i!%C!@2!@2!@2!@6!2@2!3@2!2@5!@4!@2!@2!@2!%c!8@c!3%a!5%4!3%4!5%3!5%4!3%5!@4!2@2!2@4!2@4!%2@b%2@3%g!3%5!3%5!2%2!%K!@2!@2!@2!@2!2@2!2@2!3@2!2@2!@2!@4!@8!%k@!3@!3@!2@2%d!3%4!%3!%4!3%5!3%4!5%4!@2!4@2!2@5!@2!3%x!5%3!5%4!3%5!2%F!@2!@2!@2!@2!2@v!2%k@!2@2!@!@!3@%d!%2!%b!%2!%5!%!%5!%!%5!@2!3@4!@2!@2!@4!%y!%!%5!%!%5!%!%5!%!%E!e@!3@2!@2!4@2!2@!2@2!3@!2@2!2%l@!@3!3@!@!@%R!@k!%2@l%s1@!@3!3@!@!@!@!@2!2@2!@!@!3@%e@7%@h%o@3%2!@2%2@!2%2@3%9!2@!4@!3@!2@2!@!2%3@!2@2!3@!3@!@!@!3@%s1@!3@!@!@!@!@!@!2@!@!@!3@!@!@%e@!3@!@3!@2!@!@!@!3@!2@2%6!c%5!@!%2@!@%2!@2%2@!@%b@!@5!@2!@!@!@%5@!@!@2!@2!@3!@!@2!@2%s1@u%e@!3@!@2!3@2!@2!@!@!@!@!@%7!a%6@!@%2@!2%2@!@%2@2!%b@!@!2@2!@2!2@2!@3%3@!2@3!@2!3@!3@2!@%92@!@3!2@!@!@2!@2!@!@!@!3@%n!3%2!3%2!3%2@!@%b@!4@!3@!@!@!3@%3@!@!@2!@2!@!@!@!@2!@%92@3%@m%n!3%2!2@%2!3%2!3%b@i%3@!@!@!3@!3@!@!@2!@%W2!2@%2@3%2@!2%2!3%w@k%F2";

createGame(function (R) {
    R.setSpriteSheet("fireGirl"); // set sprite sheet

    // game variables here
    let score;
    let sprtNum = 2;
    let lineX;
    let side = -1;
    let rFlame = floor(random(1, 3));
    let counter;

    let dTimer;
    let timer;
    let grav = -0.5;
    let acc = 0.3;

    let pos;
    let vel;
    let pos1;
    let pos2;
    let bpos1;
    let bpos2;

    let dead;
    let grounded;
    let left, rite;
    let border;

    let width = 64 * 5;
    let height = 48 * 5;

    let cart = this;

    let frameCount = 0;

    // starts the game
    let newGame = (dontstart) => {
        // reset game variables here

        score = 0;
        pos = createVector(16 - 4, 40 - 10);
        pos2 = createVector(floor(random(1, 32)), 30);
        pos1 = createVector(floor(random(1, 32)), 30);
        bpos1 = createVector(floor(random(1, 40)), floor(random(5, 20)));
        bpos2 = createVector(floor(random(1, 40)), floor(random(5, 20)));
        vel = createVector(0, 0);
        dead = false;
        lineX = 0;
        timer = 50;
        counter = 0;
        rite = true;
        left = false;
        border = false;

        if (!dontstart) this.draw = this.game; // make draw loop the game loop
    }
    newGame(true);

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

        R.spr([42, 0], 32 - 12, 24 - 16, 24, 15); // draw title

        let sprXs1 = [24, 32]; // list of running frames
        R.spr([sprXs1[floor((frameCount / 6) % 2)], 0], 16 - 4, 40 - 10, 8, 10); // draw bird with running animation

        let sprXs2 = [16, 21, 26, 31];
        R.spr([sprXs2[(floor(frameCount / 6) % 4)], 10], 44, 40 - 8, 4, 6);

        let s = score + ""; // make score into string
        if (s.length < 2) s = "0" + s; // if score string is 1 digit, add a 0 to the front
        R.put(s, 32 - s.length * 4, 40 - 8, 22); // draw score in the middle bottom of the screen

        if (btn.b && !pbtn.b) newGame(); // if button pressed start new game
    }
    this.draw = this.title; // make draw loop the titlescreen

    // game loop
    this.game = () => {
        frameCount++;
        R.cls(1); // clear screen to black
        R.palset(22, 1); // set to basic palette

        // game logic and draw calls goes here
        if (!border) {
            let s = score + ""; // make score into string
            if (s.length < 2) s = "0" + s; // if score string is 1 digit, add a 0 to the front
            R.put(s, 55 - s.length * 4, 10 - 8); // draw score in the top right of the screen]
        }
        borderFN();
        R.palset(22, 1);
        R.lset(9);
        sprite();
        R.lset(1);
        move();
        if (!border) {
            platforms();
            timerFN();
            R.palset(22, 1);
            flame();
        }

        if (btn.start && !pbtn.start) this.draw = this.pause; // if start button pressed, go to pause screen
    }

    // new classes go here

    function sprite() {
        if (!dead) {
            // right idel animation
            if (!btn.right && !btn.left && rite) {
                let sprXs = [24, 32]; //list of Idel frames
                R.spr([sprXs[floor(frameCount / 6) % 2], 0], pos.x, pos.y, 8, 10);
            }
            // left idel animation
            if (!btn.right && !btn.left && left) {
                let sprXs = [24, 32]; //list of Idel frames
                R.spr([sprXs[floor(frameCount / 6) % 2], 0], pos.x, pos.y, 8, 10, true);
            }
            //when holding both left and right down
            if (btn.right && btn.left) {
                let sprXs = [24, 32]; //list of Idel frames
                R.spr([sprXs[floor(frameCount / 6) % 2], 0], pos.x, pos.y, 8, 10);
            }

            // Running right
            if (btn.right && !btn.left) {
                let sprXs = [0, 8, 16];
                R.spr([sprXs[floor(frameCount / 4) % 3], 0], pos.x, pos.y, 8, 10);
            }
            // running left
            if (!btn.right && btn.left) {
                let sprXs = [0, 8, 16];
                R.spr([sprXs[floor(frameCount / 4) % 3], 0], pos.x, pos.y, 8, 10, true);
            }
        }
    }

    function move() {
        pos.add(vel);
        vel.x *= 0.80;
        vel.y -= grav;
        if (vel.y > 0) vel.y -= grav;

        if (!btn.b && vel.y < 0) {
            vel.y /= 2;
        }

        if (btn.right) {
            vel.x += acc;
            rite = true;
            left = false;
        }
        if (btn.left) {
            vel.x -= acc;
            left = true;
            rite = false;
        }
        if (btn.b && grounded) {
            grounded = false;
            vel.y = -4;
        }
    }

    function platforms() {
        if (pos.x < -1 && lineX == 0) {
            vel.x = 0;
            pos.x = -1;
        }
        if (pos.x > 57 && lineX == width && pos.y > 6) {
            vel.x = 0;
            pos.x = 57;
        }
        if (pos.x > 57 && lineX == width && pos.y < 6) {
            vel.y = 0;
            pos.y = 5;
        }
        if (side == -1 && pos.x > pos2.x - 5 && pos.x < pos2.x + 8 && pos.y + 8 >= pos2.y - 2 && pos.y + 8 <= pos2.y + 2 && vel.y > 0 || side == 1 && pos.x > pos1.x - 5 && pos.x < pos1.x + 8 && pos.y + 8 >= pos1.y - 2 && pos.y + 8 <= pos1.y + 2 && vel.y > 0) {
            pos.y = pos2.y - 9;
            vel.y = 0;
            grounded = true;
            grav = 0;
        } else {
            grav = -0.5;
            //the Ground
            if (pos.y > 30) {
                vel.y = 0;
                pos.y = 30;
                grounded = true;
            } else if (!border) grounded = false;
        }

        if (pos.x < 0 && lineX == width && !border) {
            lineX = 0;
            pos.x = 64;
            side = -1;
        }
        if (pos.x > 64 && lineX == 0 && !border) {
            lineX = width;
            pos.x = 0;
            side = 1;
        }

        // stroke(255);
        // strokeWeight(10);
        // line(lineX, 0, lineX, height - 45);
        if (side == -1) R.spr([66, 0], 8, 1, 19, 7);
        if (side == 1) R.spr([66, 9], 8, 1, 23, 7);
        // strokeWeight(5);
        // line(0, height - 42, width, height - 42);
        R.rect(lineX / 5 - 1, 0, 2, (height - 45) / 5);
        R.rect(0, (height - 45) / 5, width / 5, 1);

        //sliding the Platform around from underneath
        if (side == -1) {
            pos1.x = width * 2;
            R.spr([0, 11], pos2.x, pos2.y, 12, 2);
            if (btn.a && pos.y > pos2.y - 2) pos2.x = pos.x - 3;
        }
        if (side == 1) {
            pos2.x = width * 2;
            R.spr([0, 11], pos1.x, pos1.y, 12, 2);
            if (btn.a && pos.y > pos1.y - 2) pos1.x = pos.x - 3;
        }
    }

    function flame() {
        let sprXs = [16, 21, 26, 31]; // list of Flame frames
        //Flame #1
        R.lset(9);
        if (side == -1 && rFlame == 1) R.spr([sprXs[floor(frameCount / 6) % 4], 10], bpos1.x, bpos1.y, 4, 6);
        //Flame #2
        if (side == 1 && rFlame == 2) R.spr([sprXs[floor(frameCount / 6) % 4], 10], bpos2.x, bpos2.y, 4, 6);
        R.lset(1);

        let d1 = dist(pos.x, pos.y, bpos1.x, bpos1.y);
        let d2 = dist(pos.x, pos.y, bpos2.x, bpos2.y);
        if (d1 < 3 && side == -1 && rFlame == 1) {
            score++;
            dTimer += 2;
            rFlame = floor(random(1, 3));
            resetFlame();
        }
        if (d2 < 3 && side == 1 && rFlame == 2) {
            score++;
            dTimer += 2;
            rFlame = floor(random(1, 3));
            resetFlame();
        }
    }

    function resetFlame() {
        if (side == -1) {
            bpos1.x = floor(random(10, 40));
            bpos1.y = floor(random(5, 10));
        }
        if (side == 1) {
            bpos2.x = floor(random(10, 40));
            bpos2.y = floor(random(5, 10));
        }
    }

    function timerFN() {
        // rectMode(CORNER);
        // fill(255);
        // //text(""+counter, width/2, height/2);
        // noStroke();
        // rect(15, 70, 20, -timer);
        // noFill();
        // stroke(255);
        // strokeWeight(5);
        // rect(15, 70, 20, -60);
        R.rect(3, 2, 5, 16);
        R.fillRect(3, 17, 5, -map(timer, 1, 50, 0, 14));

        if (timer > 0) timer -= 0.05;
        if (dTimer > 0) {
            timer += dTimer;
            dTimer = 0;
        }
        if (timer <= 1) {
            GameOver();
        }
    }

    function GameOver() {
        dead = true;
        let sprXs = [97, 105, 113, 121, 129, 137, 145, 153];
        R.spr([sprXs[min(floor(counter / 4), sprXs.length - 1)], 0], pos.x, pos.y, 7, 10);

        if (counter < 40) counter += 1;
        vel.x = 0;
        vel.y = 0;

        if (counter > 39) cart.draw = cart.title;
    }

    function borderFN() {
        // let width = 64 * 5;
        // let height = 48 * 5;

        if (pos.x > 70 && lineX == width && pos.y < 6) {
            vel.y = 0;
            pos.y = 20;
            pos.x = -1;
            border = true;
            grounded = true;
        }
        if (border) {
            lineX = width;
            if (pos.y >= 20 && pos.x < 30) {
                vel.y = 0;
                pos.y = 20;
                grav = 0;
            } else if (pos.y >= 37 && pos.x > 29) {
                vel.y = 0;
                pos.y = 37;
                grav = 0;
                grounded = true;
            } else {
                grounded = false;
                grav = -0.5;
            }
            //stop at left wall under hallway
            if (pos.x < 31 && pos.y > 20) {
                vel.x = 0;
                pos.x = 31;
            }
            //stop at right wall under hallway
            if (pos.x > 55) {
                vel.x = 0;
                pos.x = 55;
            }

            // width = 64;
            // height = 48;

            // //hallway lines Top
            // R.lget().stroke(255);
            // R.lget().line(0, height / 2 - 8, width / 2, height / 2 - 8);
            // //Hallway Lines Bottom
            // R.lget().line(0, height / 2 + 28, width / 2, height / 2 + 28);
            // //Box
            // R.rect(width / 2, height / 2 - 40, 150/5, 150/5);
            // //Extra Line
            // R.rect(width / 2, height / 2 - 40, -35, 27);
            // R.rect(width / 2, height / 2 - 35, -30, 58);
            R.rect(0, 48 / 2 + 5, 64 / 2, 1);
            R.rect(0, 48 / 2 - 4, 64 / 2, 1);

            R.spr([166, 0], 10, 2, 47, 12);

            R.spr([224, 0], 34, 20, 34, 14);

            if (btn.b && grounded && pos.x > 30) {
                grounded = false;
                vel.y = -4;
            }
            if (pos.x < -15 && lineX == width) {
                border = false;
                pos.x = 57;
                pos.y = 6;
            }
        }
    }

});