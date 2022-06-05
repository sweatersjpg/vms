
// Pixel Perfect p5 Engine (3p5E)
// by sweatersjpg

var cvs;

const FRAMERATE = 30;

const PAL = [
  '#060608', '#141013', '#3b1725', '#73172d', '#b4202a', '#df3e23', '#fa6a0a', '#f9a31b',
  '#ffd541', '#fffc40', '#d6f264', '#9cdb43', '#59c135', '#14a02e', '#1a7a3e', '#24523b',
  '#122020', '#143464', '#285cc4', '#249fde', '#20d6c7', '#a6fcdb', '#ffffff', '#fef3c0',
  '#fad6b8', '#f5a097', '#e86a73', '#bc4a9b', '#793a80', '#403353', '#242234', '#221c1a',
  '#322b28', '#71413b', '#bb7547', '#dba463', '#f4d29c', '#dae0ea', '#b3b9d1', '#8b93af',
  '#6d758d', '#4a5462', '#333941', '#422433', '#5b3138', '#8e5252', '#ba756a', '#e9b5a3',
  '#e3e6ff', '#b9bffb', '#849be4', '#588dbe', '#477d85', '#23674e', '#328464', '#5daf8d',
  '#92dcba', '#cdf7e2', '#e4d2aa', '#c7b08b', '#a08662', '#796755', '#5a4e44', '#423934'
];

var FNT = "@9!@e!@!@5!3@t1!2@7!@6!2@6!3@5!@!@5!3@6!2@5!3@5!2@7!2@J!2@f!@6!@!@5!3@5!2@6!@!@6!2@6!@8!@6!@M!@5!@!@5!2@8!@7!@5!@!@5!@7!@9!@5!@!@5!@!@L!@e!@6!@!@5!@!@6!2@6!2@6!2@6!@7!@8!@6!2@6!@v!@6!@!@6!@6!3@6!@7!2@5!3@5!3@7!@5!3@5!3@6!@7!@8!@5!3@6!@7!@u!3@5!3@5!2@6!@!@e!@8!@6!2@5!3@d!3@e!@6!@!@6!@6!@9!@7!@7!@5!@!@7!@5!@!@7!@m!@g!@m!@e!@!@6!@6!@!@5!2@!@d!@8!@e!@7!@f!@6!@8!2@5!3@5!3@5!2@8!@5!2@6!2@8!@6!2@5!2@7!@7!@8!@5!3@6!@7!@81!@6!@n!@T1!@D8!@#3!@!@6!@6!2@7!2@5!2@6!3@5!3@6!2@5!@!@5!3@6!2@5!@!@5!@7!3@5!2@7!@6!2@7!@6!2@7!2@5!3@5!@!@5!@!@5!@!@5!@!@5!@!@5!3@6!2@5!@8!2@6!@e!@!@5!@!@5!2@6!@7!@!@5!2@6!@7!@7!@!@6!@8!@5!2@6!@7!3@5!@!@5!@!@5!@!@5!@!@5!@!@5!@8!@6!@!@5!@!@5!@!@6!@6!@!@7!@6!@7!@8!@5!@!@d!@7!3@5!@!@5!@7!@!@5!@7!3@5!@!@5!3@6!@6!@!@5!@!@5!@7!@!@5!@!@5!@!@5!3@5!@!@5!2@7!2@6!@6!@!@5!@!@5!3@5!@!@6!@6!2@7!@7!@8!@m!2@5!@!@5!3@6!2@5!2@6!3@5!@7!3@5!@!@5!3@6!@6!@!@5!3@5!@!@5!@!@6!@6!@8!2@5!@!@5!2@7!@7!2@6!@6!3@5!@!@6!@6!3@6!2@7!@6!2@d!4@kc!@h!@f!@d!@8!@8!@5!@8!@T1!2@6!@6!2@n!@e!@h!@6!2@6!@e!@n!@8!@$!@T!@7!@7!@7!2@e!@7!2@5!2@7!2@6!2@5!@!@5!3@6!2@5!2@7!@8!@5!@!@6!@6!3@5!2@7!@6!2@7!2@6!2@6!2@5!3@5!@!@5!@!@5!@!@5!@!@5!@!@5!2@6!2@f!2@5!2@m!@!@5!@!@5!@7!@!@5!2@7!@6!@!@5!@!@6!@8!@5!2@7!@6!3@5!@!@5!@!@5!@!@5!@!@5!@8!@7!@6!@!@5!3@5!3@6!@6!@!@6!@7!@7!@7!@v!2@5!2@7!2@6!2@6!2@6!@6!3@5!@!@6!@8!@5!@!@7!@5!@!@5!@!@6!@6!3@5!3@5!@7!2@8!@6!2@6!@6!3@5!@!@5!3@6!2@6!2@6!@6!2@g1!@m!@K!@9!@$!@J1!2@61!@9!@Z!2@SA";

let defaultControls_ = [[87, 38], [83, 40], [65, 37], [68, 39], [82, 32], 69, 27, [9, 81]];
let controls_ = defaultControls_;

let controlsP2_ = [38, 40, 37, 39, 13, 222];

const btnlist = ['up', 'down', 'left', 'right', 'a', 'b', 'start', 'select'];

let nplayers = 0;

let player_ = [];

const gamepad = new Gamepad();

let gamepadbtns = [
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8)
]
let pregamepadbtns = [
  new Array(8),
  new Array(8),
  new Array(8),
  new Array(8)
]

let sprData = [];
let sprDataID = "";

function setup() {

  cvs = createCanvas(1000, 800);
  let canvasElement = cvs.elt;
  let ctx = canvasElement.getContext('2d');
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  frameRate(FRAMERATE);
  // p5.disableFriendlyErrors = true;

  setControls(controls_);

  if (typeof init_ !== 'undefined') init_();

}

function draw() {

  

  for (var i = 0; i < gamepadbtns.length; i++) pregamepadbtns[i] = gamepadbtns[i].slice();
}

//-----------------------

function keyPressed() {
  if (controlsP2_.includes(keyCode)) gamepadbtns[1][controlsP2_.indexOf(keyCode)] = true;
}
function keyReleased() {
  if (controlsP2_.includes(keyCode)) gamepadbtns[1][controlsP2_.indexOf(keyCode)] = false;
}

//-----------------------

function btn(button, p) {
  let i = button;
  if (typeof button === 'string') i = btnlist.indexOf(button);
  if (typeof p === 'undefined') p = 0;
  return gamepadbtns[p][i];
}

function pbtn(button, p) {
  let i = button;
  if (typeof button === 'string') i = btnlist.indexOf(button);
  if (typeof p === 'undefined') p = 0;
  return pregamepadbtns[p][i];
}

//-----------------------

function setControls(a) {
  controls_ = a;
  gamepad.setCustomMapping('keyboard', {
    'd_pad_up': a[0],
    'd_pad_down': a[1],
    'd_pad_left': a[2],
    'd_pad_right': a[3],
    'button_1': a[4],
    'button_3': a[5],
    'start': a[6],
    'select': a[7]
  });
}

function setSpriteSheet(s) {
  // TODO: make sure it's not re'uncompressing sprite data
  let data;
  if (typeof s !== 'string') {
    data = s;
    sprDataID += "!";
  } else {
    sprDataID = s;
    data = window[s];
  }
  if (typeof data == 'string') {
    sprData = uncompress(data);
  } else {
    sprData = Object.assign([], data);
  }
}

function uncompress(str) {
  let keyA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$';
  let keyB = "!@%^&*()_+={}[]<>,./?|`~:;-¡€™‹›£¢ﬁ∞ﬂ§‡¶°•·ª‚º—±≠«»‘’“”ÆæÚ…¿÷˘≥≤";
  data = [];

  for (var i = 0; i < str.length; i++) {
    let count = 0;
    let color = keyB.indexOf(str.charAt(i));
    if (keyA.includes(str.charAt(i + 1))) {
      count += keyA.indexOf(str.charAt(i + 1));
      if (keyA.includes(str.charAt(i + 2))) {
        count += keyA.indexOf(str.charAt(i + 2)) * 64;
        i += 2;
      } else i += 1;
    } else count = 1;
    if (count) data = data.concat(new Array(count).fill(color));
  }
  return data;
}

function compress(data) {
  let keyB = "!@%^&*()_+={}[]<>,./?|`~:;-¡€™‹›£¢ﬁ∞ﬂ§‡¶°•·ª‚º—±≠«»‘’“”ÆæÚ…¿÷˘≥≤";
  let str = "";

  function tob64(n) {
    let keyA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$';
    let p1 = keyA.charAt(Math.floor(n / 64));
    let p2 = keyA.charAt(n % 64);
    if (p1 == '0') return p2;
    else return p2 + p1;
  }

  let char = "start";
  let count = 0;
  for (var i = 0; i < data.length; i++) {
    if (char != keyB.charAt(data[i]) || count == 4095) {
      if (count) {
        str += char + "";
        if (count > 1) str += tob64(count) + "";
      }
      char = keyB.charAt(data[i]);
      count = 0;
    }
    count++;
  }
  str += char + tob64(count);
  return str;
}

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function setColorAtIndex(img, x, y, clr) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  pix[idx] = red(clr);
  pix[idx + 1] = green(clr);
  pix[idx + 2] = blue(clr);
  pix[idx + 3] = alpha(clr);
}

function setButton(n, b, e) {
  e = e || 'keyboard';
  if (e.player == 'keyboard') p = 0;
  else p = player_.indexOf(e.player);
  gamepadbtns[p][n] = b;
}

gamepad.on('connect', e => {
  player_.push(e.index);
  nplayers += 1;
  console.log(`player ${e.index} has connected.`);
});
gamepad.on('disconnect', e => {
  player_.splice(player_.indexOf(e.index), 1);
  nplayers -= 1;
  console.log(`player ${e.index} has disconnected.`);
});

let _btns = ['d_pad_up', 'd_pad_down', 'd_pad_left', 'd_pad_right', 'button_0', 'button_1', 'button_2', 'button_3', 'start', 'select'];

for (const b of _btns) {
  gamepad.on('press', b, e => { setButton(_btns.indexOf(b), true, e); });
  gamepad.on('release', b, e => { setButton(_btns.indexOf(b), false, e); });
}

gamepad.on('hold', 'stick_axis_left', e => {
  let th = 0.2;
  if (e.value[0] > th) setButton(3, true, e);
  else setButton(3, false, e);
  if (e.value[0] < -th) setButton(2, true, e);
  else setButton(2, false, e);
  if (e.value[1] > th) setButton(1, true, e);
  else setButton(1, false, e);
  if (e.value[1] < -th) setButton(0, true, e);
  else setButton(0, false, e);
});
gamepad.on('release', 'stick_axis_left', e => {
  setButton(3, false, e);
  setButton(2, false, e);
  setButton(1, false, e);
  setButton(0, false, e);
});