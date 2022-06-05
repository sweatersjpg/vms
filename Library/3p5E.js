
// 3p5E by sweatersjpg

let cvs; // canvas

const FRAMERATE = 60; // aim for 60 if possible, but idk

const WIDTH = 400;
const HEIGHT = 240;

const PAL = [
    '#060508', '#141013', '#3b1725', '#73172d', '#b4202a', '#df3e23', '#fa6a0a', '#f9a31b',
    '#ffd541', '#fffc40', '#d6f264', '#9cdb43', '#59c135', '#14a02e', '#1a7a3e', '#24523b',
    '#122020', '#143464', '#285cc4', '#249fde', '#20d6c7', '#a6fcdb', '#ffffff', '#fef3c0',
    '#fad6b8', '#f5a097', '#e86a73', '#bc4a9b', '#793a80', '#403353', '#242234', '#221c1a',
    '#322b28', '#71413b', '#bb7547', '#dba463', '#f4d29c', '#dae0ea', '#b3b9d1', '#8b93af',
    '#6d758d', '#4a5462', '#333941', '#422433', '#5b3138', '#8e5252', '#ba756a', '#e9b5a3',
    '#e3e6ff', '#b9bffb', '#849be4', '#588dbe', '#477d85', '#23674e', '#328464', '#5daf8d',
    '#92dcba', '#cdf7e2', '#e4d2aa', '#c7b08b', '#a08662', '#796755', '#5a4e44', '#423934'
];

let btn;
let pbtn;

let main;
let paused = false;

let R;

let lightBorder;
let mouse;
let pmouse;

let testImg;

function setup() {
    let w = windowWidth;
    let h = windowWidth * HEIGHT / WIDTH;

    if (h > windowHeight) {
        w = windowHeight * WIDTH / HEIGHT;
        h = windowHeight;
    }

    cvs = createCanvas(w, h);

    let canvasElement = cvs.elt;
    let ctx = canvasElement.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    p5.disableFriendlyErrors = true;

    frameRate(FRAMERATE);

    R = new ppRenderer(30);

    btn = new TwoPlayerInput();
    pbtn = btn.copy();

    mouse = createVector();
    pmouse = createVector();

    if (typeof init !== 'undefined') init();

    // R.setSpriteSheet('spriteSheet');
    // R.palset(22, 0);

    disableScroll();

}

function draw() {
    // background(0);

    if (!paused) {
        R.cls(38);
        let S = width / WIDTH;
        mouse.set(floor(mouseX / S), floor(mouseY / S));
        pmouse.set(floor(pmouseX / S), floor(pmouseY / S))
        main.draw();
    }

    R.display();
    // if (paused) paused.display();

    // if (btn.start && !pbtn.start) {
    //     if (paused) paused = false;
    //     else paused = new PauseMenu();
    // }

    if (frameCount % 2 == 0) pbtn = btn.copy();
}

// --- renderer ---



// --- controls ---

function keyPressed() {
    for (let p = 0; p < 2; p++) for (let k = 0; k < btn[p].c.length; k++) {
        let same = btn[p].c[k] == keyCode;
        if (btn[p].c[k].length) same = btn[p].c[k].includes(keyCode);
        if (same) btn[p][Object.keys(btn[p])[k + 1]] = true;
    }
    btn.makeSelfDefault();
}

function keyReleased() {
    for (let p = 0; p < 2; p++) for (let k = 0; k < btn[p].c.length; k++) {
        let same = btn[p].c[k] == keyCode;
        if (btn[p].c[k].length) same = btn[p].c[k].includes(keyCode);
        if (same) btn[p][Object.keys(btn[p])[k + 1]] = false;
    }
    btn.makeSelfDefault();
}

function TwoPlayerInput() {
    // default controls
    this[0] = {
        c: [[87, 38], [83, 40], [65, 37], [68, 39], [13, 88], [32, 90], false, false, [27, 81], [9, 69]]
    }
    this[1] = { c: [] }

    let btnKeys = ['up', 'down', 'left', 'right', 'a', 'b', 'x', 'y', 'start', 'select'];
    for (let b of btnKeys) {
        this[0][b] = false;
        this[1][b] = false;
    }

    this.copy = () => {
        // return JSON.parse(JSON.stringify(this));
        let copy = new TwoPlayerInput();
        copy[0] = JSON.parse(JSON.stringify(this[0]));
        copy[1] = JSON.parse(JSON.stringify(this[1]));
        copy.makeSelfDefault();
        return copy;
    }
    this.makeSelfDefault = () => {
        for (const k in this[0]) this[k] = this[0][k];
    }
}

function windowResized() {
    let w = windowWidth;
    let h = windowWidth * HEIGHT / WIDTH;

    if (h > windowHeight) {
        w = windowHeight * WIDTH / HEIGHT;
        h = windowHeight;
    }

    resizeCanvas(w, h);
}

let eventsToAdd = ['keydown', 'mousedown', 'mouseup', 'dblclick', 'blur', 'focus', 'touchstart', 'touchend'];
for (let EVENT of eventsToAdd)
    window.addEventListener(EVENT, e => {
        if (!paused && main && main[EVENT]) main[EVENT](e);
    });

function disableScroll() {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    function preventDefault(e) { e.preventDefault(); }
    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }
    var supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; }
        }));
    } catch (e) { }
    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}