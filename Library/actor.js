

function Actor(game, x, y, w, h, dontAdd) {
    if (!dontAdd) game.actors.push(this);
    this.pos = new Vector(x, y);
    this.vel = new Vector();
    this.size = new Vector(w, h);
    this.inertia = 0.9;
    this.bounce = 0;
    this.still = false;
    this.gravity = 1;

    this.update = () => {

    }

    this.draw = () => {
        if (this.collided()) R.palset(4, 0);
        else R.palset(22, 0);
        R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    this.debug = () => {
        if (!DEBUG) return;

        R.lset(122);
        R.palset(4, 0);
        R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    let stillCount = 0;
    this.move = () => {
        if (this.vel.mag() < 0.5) stillCount++
        else stillCount = 0;

        this.still = stillCount > 2;

        //gravity
        this.vel.add(0, this.gravity);

        // this.vel.mult(this.inertia);
        this.vel.x *= this.inertia;

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

    this.collided = () => {

        let contact = false;
        for (let a of game.actors) {
            if (a == this || a.notSolid || this.notSolid) continue;
            if (collided(this.pos, this.size, a.pos, a.size)) {
                contact = a;
                break;
            }
        }

        for (let w of game.walls) {
            if (collided(this.pos, this.size, w.pos, w.size)) return true;
        }

        return contact;
    }

    this.kill = () => {
        game.actors.splice(game.actors.indexOf(this), 1);
    }
}

function collided(p1, s1, p2, s2) {
    let x = (p1.x + s1.x > p2.x && p2.x + s2.x > p1.x);
    let y = (p1.y + s1.y > p2.y && p2.y + s2.y > p1.y);
    return x && y;
}

function getLayer(y) {
    return map(y, 0, 216, 2, 120, true);
}

function Wall(game, x, y, w, h) {
    game.walls.push(this);
    this.pos = new Vector(x, y);
    this.size = new Vector(w, h);

    this.draw = () => {

        // R.lset(getLayer(this.pos.y + this.size.y));

        // R.palset(0);
        // R.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        // R.palset(22, 0);
        // R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        // R.palset(0);
        // R.fillRect(this.pos.x, this.pos.y - 16, this.size.x, this.size.y - 24);
        // R.palset(22);
        // R.rect(this.pos.x, this.pos.y - 16, this.size.x, this.size.y - 24);

        if (!DEBUG) return;
        R.lset(121);
        R.palset(4, 0);
        R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}

function InvisWall(game, x, y, w, h) {
    Wall.call(this, game, x, y, w, h);

    this.draw = () => {
        if (!DEBUG) return;

        R.lset(121);
        R.palset(4, 0);
        R.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}

function InvertedWall(game, x, y, w, h) {
    Actor.call(this, game, x, y, w, h);

    this.notSolid = true;
    this.visual = true;

    let s = 4;
    new InvisWall(game, this.pos.x, this.pos.y - s, this.size.x, s);
    new InvisWall(game, this.pos.x - s, this.pos.y, 4, this.size.y);
    new InvisWall(game, this.pos.x, this.pos.y + this.size.y, this.size.x, s);
    new InvisWall(game, this.pos.x + this.size.x, this.pos.y, 4, this.size.y);

    this.draw = () => {

        R.lset(getLayer(this.pos.y));

        R.palset(0);
        R.fillRect(this.pos.x, this.pos.y - 16, this.size.x, 17);
        R.palset(22);
        R.rect(this.pos.x, this.pos.y - 16, this.size.x, 17);

        R.lset(getLayer(this.pos.y + this.size.y + 2));

        R.rect(this.pos.x, this.pos.y - 16, 1, this.size.y + 16 - 8);
        R.rect(this.pos.x + this.size.x - 1, this.pos.y - 16, 1, this.size.y + 16 - 8);

        R.palset(0);
        R.fillRect(this.pos.x - 4, this.pos.y - 16, 4, this.size.y + 16);
        R.fillRect(this.pos.x + this.size.x, this.pos.y - 16, 4, this.size.y + 16);

        R.palset(22);
        R.rect(this.pos.x, this.pos.y + this.size.y - 9, this.size.x, 1);
        R.palset(0);
        R.fillRect(this.pos.x, this.pos.y + this.size.y - 8, this.size.x, 8);

    }
}
