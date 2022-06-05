let DEBUG = false;
let carts = [];

function init() {
    main = new Main();
}

function createGame(cart) {
    carts.push(cart);
}

function Main() {
    this.vms = [];
    R.setSpriteSheet('gbSprites');
    this.held = false;

    let count = 0;
    for (let Cart of carts) {
        // let machine = new VM(this, 16 + count * (72 + 2), 16, count * 10);
        let machine = new VM(this, WIDTH / 2 - 36, HEIGHT / 2 - 46, count * 10);
        let cart = new Cart(machine.R);

        machine.cart = cart;
        cart.parent = machine;
        cart.width = 64;
        cart.height = 48;

        count++;
    }

    this.draw = () => {
        // R.put(floor(frameRate()) + "");

        if (this.held) {
            let target = createVector(mouse.x - this.held.offset.x, mouse.y - this.held.offset.y, this.held.offset.z);

            this.held.vel.x = (target.x - this.held.pos.x) / 2;
            this.held.vel.y = (target.y - this.held.pos.y) / 2;

            let highest = { pos: { z: 0 } };

            for (let vm of this.vms) if (vm != this.held) {
                if (this.held.overlap(vm, true) && vm.pos.z >= highest.pos.z) highest = vm;
            }

            if (highest.vel) this.held.offset.z = highest.pos.z + 18;
            else this.held.offset.z = 10;

            // this.held.move((target.x - this.held.pos.x) / 2, (target.y - this.held.pos.y) / 2, 0);
            this.held.pos.z = this.held.offset.z;
            this.held.vel.z = 0;
        }

        if (mouseIsPressed) cursor("grabbing");
        else cursor("grab");

        let highest = { pos: { z: 0 } };
        for (let vm of this.vms) {
            vm.highlighted = false;
            if (vm.mouseOver() && vm.pos.z >= highest.pos.z) highest = vm;
        }
        if (highest.vel && !this.held) highest.highlighted = true;

        for (let vm of this.vms) vm.display();
        for (let vm of this.vms) vm.doPhysics();
    }

    this.mousedown = () => {
        let bestHeight = 0;
        let highest = { pos: { z: 0 } };

        for (let vm of this.vms) {
            if (vm.pos.z > bestHeight) bestHeight = vm.pos.z;
            if (vm.mouseOver() && vm.pos.z >= highest.pos.z) highest = vm;
        }

        // console.log(highest);

        if (highest.vel) {
            this.held = highest;
            if (this.selected && this.selected != this.held) this.selected.unfocus();
            this.selected = this.held;
            this.held.focus();
            this.held.offset = createVector(mouse.x - this.held.pos.x, mouse.y - this.held.pos.y, /*bestHeight*/ + 16);
        } else {
            if (this.selected) this.selected.unfocus();
            this.selected = false;
        }
    }

    this.mouseup = () => {
        // console.log(this.held);
        this.held = false;
    }
}

let pals = [
    [24, 25, 26, 0], // red
    [37, 41, 42, 0], // black
    [27, 28, 29, 0], // purple
    [22, 24, 25, 0], // pink
    [38, 38, 37, 0], // white
    // [23, 23, 58, 0]
]
let buttonPals = [
    [25, 3, 3, 2, 25, 3],    // red
    [30, 1, 30, 1, 30, 1],   // black
    [28, 30, 30, 1, 28, 30], // purple
    [24, 46, 26, 3, 24, 46], // pink
    [42, 1, 26, 3, 39, 41],   // white
    // [42, 1, 26, 3, 39, 41]
]

function VM(game, x, y, z) {
    game.vms.push(this);

    this.pos = createVector(x || 64, y || 64, z || 0);
    this.vel = createVector(0, 0, 0);
    this.size = createVector(72, 93, 8);

    this.cart = false;

    this.R = new ppRenderer(10, 64, 48);

    let pal = random(pals);
    let buttonPal = buttonPals[pals.indexOf(pal)];

    buttonPals.splice(buttonPals.indexOf(buttonPal), 1);
    pals.splice(pals.indexOf(pal), 1);

    let ID = "case" + pal.join("");

    R.startMetaSpr(ID);
    R.palset(...pal);
    R.spr(0, 0, 0, 5, 3);
    R.spr(5, 0, 48, 5, 3);
    R.endMetaSpr(0, 0);

    let drawButton = (trigger, spx, spy, x, y, w, h, c) => {
        let pal = [buttonPal[0 + c], buttonPal[0 + c], buttonPal[1 + c]] // 41, 42
        if (trigger && this == game.selected) pal = [buttonPal[1 + c], 64, buttonPal[1 + c]];
        R.palset(...pal);
        R.spr([spx, spy], this.pos.x + x, this.pos.y + y - this.pos.z, w, h);
    }

    let drawButtons = () => {
        drawButton(btn.left, 160, 18, 8, 67, 10, 7, 0);
        drawButton(btn.right, 160, 25, 20, 67, 10, 7, 0);
        drawButton(btn.up, 160, 0, 16, 59, 6, 11, 0);
        drawButton(btn.down, 166, 0, 16, 71, 6, 11, 0);
        drawButton(btn.b, 169, 11, 45, 69, 7, 8, 2);
        drawButton(btn.a, 169, 11, 56, 64, 7, 8, 2);
        drawButton(btn.start, 160, 13, 28, 58, 6, 3, 4);
        drawButton(btn.select, 160, 13, 38, 58, 6, 3, 4);
    }

    this.mouseOver = () => {
        let x = (mouse.x > this.pos.x && mouse.x < this.pos.x + this.size.x);
        let y = (mouse.y > (this.pos.y - this.pos.z) && mouse.y < (this.pos.y - this.pos.z) + this.size.y);
        return x && y;
    }

    this.move = (x, y, z, movee) => {

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
                this.vel.x *= 0;
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
                this.vel.y *= 0;
                break;
            }
        }

        steps = floor(abs(this.vel.z) / this.size.z) + 1;
        sign = this.vel.z / abs(this.vel.z);
        let oldz = this.pos.z;
        for (let z = 0; z < steps; z++) {
            oldz = this.pos.z;
            this.pos.z += this.vel.z / steps;
            if (this.collided()) {
                this.pos.z = round(oldz);
                while (!this.collided()) {
                    oldz = this.pos.z;
                    this.pos.z += sign;
                }
                this.pos.z = oldz;
                this.vel.z *= 0;
                break;
            }
        }

    }

    this.collided = () => {
        if (this.pos.x < 0 || this.pos.x + this.size.x > WIDTH) return true;
        if (this.pos.y < 0 || this.pos.y + this.size.y > HEIGHT) return true;
        if (this.pos.z < 0) return true;

        for (let other of game.vms) if (other == this || this == game.held) continue;
        else if (this.overlap(other)) return true;

        return false;
    }

    this.overlap = (b, ignoreHeight) => {
        let a = this;
        let x = (a.pos.x + a.size.x > b.pos.x && a.pos.x < b.pos.x + b.size.x);
        let y = (a.pos.y + a.size.y > b.pos.y && a.pos.y < b.pos.y + b.size.y);
        let z = (a.pos.z + a.size.z > b.pos.z && a.pos.z < b.pos.z + b.size.z);
        if (ignoreHeight) z = true;
        return x && y && z;
    }

    this.setHeight = (h) => {
        this.pos.z = h;
        this.vel.z = 0;
    }

    this.doPhysics = () => {

        this.vel.z -= 0.25;
        if (this.vel.z < -4) this.vel.z = -4;
        if (this.vel.z > 4) this.vel.z = 4;

        // if (abs(this.vel.x) > 0 || abs(this.vel.y) > 0) this.move(this.vel.x, this.vel.y, 0);

        this.vel.x *= 0.9;
        this.vel.y *= 0.9;

        this.move(this.vel.x, this.vel.y, this.vel.z);

    }

    this.focus = () => {
        if (this.cart.onFocus) this.cart.onFocus();
    }
    this.unfocus = () => {
        if (this.cart.onUnfocus) this.cart.onUnfocus();
    }

    this.display = () => {
        R.lset(0);

        let shaddowPos = createVector(1, 4);
        R.palset(41, 41, 41, 41);
        R.spr(0, this.pos.x + shaddowPos.x, this.pos.y + shaddowPos.y, 5, 3);
        R.spr(5, this.pos.x + shaddowPos.x, this.pos.y + shaddowPos.y + 48, 5, 3);
        R.fillRect(floor(this.pos.x + 4 + shaddowPos.x), floor(this.pos.y + 4 + shaddowPos.y), 64, 80);

        R.lset((floor(this.pos.z / this.size.z) + 1) % 100);

        if (this.highlighted || game.held == this || game.selected == this) {
            R.palset(22, 22, 64);
            R.spr(11, this.pos.x - 1, this.pos.y - 1 - this.pos.z, 5, 3);
            R.palset(64, 22, 22);
            R.spr(11, this.pos.x - 1, this.pos.y - 1 + 48 - this.pos.z, 5, 3);
        }

        R.metaSpr(ID, round(this.pos.x), round(this.pos.y - this.pos.z));
        drawButtons();

        let oldBtn = btn.copy();
        if (game.selected != this) btn = new TwoPlayerInput();

        let displayLayer = R.buffer[R.currentLayer];

        if (frameCount % 2 == 0) {
            if (this.cart && this.cart.draw) this.cart.draw();
            else this.R.cls(1);
        }

        this.R.display(round(this.pos.x + 4), round(this.pos.y + 4 - this.pos.z), displayLayer);
        // if (this.cart.meta) {
        //     this.cart.draw();
        //     this.R.display(round(this.pos.x + 4), round(this.pos.y + 4 - this.pos.z), displayLayer);
        // }

        btn = oldBtn.copy();

    }

}