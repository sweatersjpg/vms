function ppRenderer(bufferSize, w, h) {
    this.width = w || WIDTH;
    this.height = h || HEIGHT;
    this.length = bufferSize;

    this.sprCPF = 0;
    this.maxSprCalls = 750;
    this.flickerRange = [this.maxSprCalls, 0, 0];

    this.sprCache = {};
    this.sprData;
    this.sprDataID = "spriteSheet";

    this.currentLayer = Math.floor(bufferSize / 2);
    this.currentPal = [22, 38, 39, 40, 41, 42, 0];

    this.currentMetaSpr = false;

    this.buffer = [];
    for (let i = 0; i < bufferSize; i++) {
        let b = createGraphics(this.width, this.height);
        b.noSmooth();
        b.pixelDensity(1);
        this.buffer.push(b);
    }

    this.display = (x, y, targetBuffer, w, h) => {
        for (const b of this.buffer) {
            if (b.hasChanged) {
                if (!targetBuffer) image(b, 0, 0, width, height);
                else targetBuffer.image(b, x, y, w || this.width, h || this.height);
            }
        }
        this.cursor.x = 0;
        this.cursor.y = 0;
    }

    this.cls = (cIndex, isMain) => {
        // if (isMain) background(PAL[cIndex]);
        this.buffer[0].background(PAL[cIndex]);
        this.buffer[0].hasChanged = true;
        cIndex = cIndex || 0;
        for (let b = 1; b < bufferSize; b++) {
            if (this.buffer[b].hasChanged) this.buffer[b].clear();
            this.buffer[b].hasChanged = false;
        }

        this.sprCPF = 0;
    }

    this.palset = (...pal) => {
        this.currentPal = pal;
    }

    this.lset = (layer) => {
        if (typeof layer === 'undefined') layer = Math.floor(bufferSize / 2);
        this.currentLayer = Math.floor(layer);
    }

    this.lget = () => {
        return this.buffer[this.currentLayer];
    }

    this.hashFromSpr = (index, w, h) => {
        // return [this.sprDataID, this.currentPal, index, w, h].join("").hashCode();
        return [this.sprDataID, this.currentPal, index, w, h].join("");
    }

    this.metaSpr = (ID, ...rest) => {
        if (!this.sprCache.hasOwnProperty(ID)) throw 'meta sprite: ' + ID + ' does not exist';
        this.startMetaSpr(ID);
        this.endMetaSpr(...rest);
    }

    this.startMetaSpr = (ID) => {
        if (!this.sprCache.hasOwnProperty(ID)) {
            this.sprCache[ID] = { IDs: [], done: false, sw: 8, sh: 8 }
            let b = createGraphics(WIDTH, HEIGHT);
            b.noSmooth();
            b.pixelDensity(1);
            this.sprCache[ID].img = b;
        }

        this.currentMetaSpr = this.sprCache[ID];
    }

    this.endMetaSpr = (dx, dy, flipped, angle, dw, dh) => {
        if (!this.currentMetaSpr) return;

        if (!this.currentMetaSpr.done) {
            let img = createImage(this.currentMetaSpr.sw, this.currentMetaSpr.sh);
            let w = this.currentMetaSpr.img.width;
            let h = this.currentMetaSpr.img.height;
            img.copy(this.currentMetaSpr.img, 0, 0, w, h, 0, 0, w, h);
            this.currentMetaSpr.img.remove();
            this.currentMetaSpr.img = img;
            this.currentMetaSpr.done = true;
        }

        let img = this.currentMetaSpr.img;

        if (typeof dw === 'undefined') dw = img.width;
        if (typeof dh === 'undefined') dh = img.height;

        if (typeof dx === 'undefined') dx = 0;
        if (typeof dy === 'undefined') dy = 0;

        let graphics = this.buffer[this.currentLayer];
        graphics.hasChanged = true;

        if (angle || flipped) {
            graphics.push();
            graphics.translate(dx + dw / 2, dy + dh / 2);
            if (angle) graphics.rotate(angle);
            if (flipped) graphics.scale(-1, 1);
            graphics.image(img, -dw / 2, -dh / 2, dw, dh);
            graphics.pop();
        } else graphics.image(img, dx, dy, dw, dh);

        this.currentMetaSpr = false;
        this.sprCPF++;
    }

    this.spr = (index, dx, dy, sw, sh, flipped, angle, dw, dh) => {

        if (index.length) {
            if (index.length == 2) sx = Math.floor(index[0]), sy = Math.floor(index[1]);
            else sx = Math.floor(index[0] % 16) * 16, sy = Math.floor(index[0] / 16) * 16;
            index = JSON.stringify(index);

            if (typeof sw === 'undefined') sw = 8;
            if (typeof sh === 'undefined') sh = 8;

            if (typeof dw === 'undefined') dw = sw;
            if (typeof dh === 'undefined') dh = sh;

        } else {
            sx = Math.floor(index % 16) * 16;
            sy = Math.floor(index / 16) * 16;

            if (typeof sw === 'undefined') sw = 1;
            if (typeof sh === 'undefined') sh = 1;
            sw *= 16, sh *= 16;

            if (typeof dw === 'undefined') dw = sw;
            if (typeof dh === 'undefined') dh = sh;
        }

        let hash = this.hashFromSpr(index, sw, sh);

        let suffix = "" + dx + dy + flipped + angle + dw + dh;
        if (this.currentMetaSpr && (this.currentMetaSpr.IDs.includes(hash + suffix) || this.currentMetaSpr.done)) return;

        if (!this.sprCache.hasOwnProperty(hash)) {
            let img = createImage(sw + 2, sh + 2);
            img.loadPixels();

            let pal = [];
            for (let i = 0; i < 64; i++)
                if (typeof this.currentPal[i] === 'undefined') pal.push(64);
                else pal.push(this.currentPal[i]);

            for (let y = 0; y < img.height - 2; y++)
                for (let x = 0; x < img.width - 2; x++) {
                    let i = (sx + x) + (sy + y) * 256;
                    if (typeof this.sprData[i] === 'undefined') continue;
                    let c = pal[this.sprData[i]];
                    if (c == 64) continue;
                    setColorAtIndex(img, x + 1, y + 1, PAL[c]);
                }

            img.updatePixels();
            this.sprCache[hash] = img;
        }
        let img = this.sprCache[hash];

        dx -= dw / (sw);
        dy -= dh / (sh);
        dw += 2 * dw / (sw);
        dh += 2 * dh / (sh);

        let graphics;
        if (typeof this.currentLayer === 'number') graphics = this.buffer[this.currentLayer];
        else graphics = this.currentLayer;
        graphics.hasChanged = true;
        if (this.currentMetaSpr) {
            graphics = this.currentMetaSpr.img;
            this.currentMetaSpr.IDs.push(hash + suffix);

            if (dx + dw > this.currentMetaSpr.sw) this.currentMetaSpr.sw = dx + dw;
            if (dy + dh > this.currentMetaSpr.sh) this.currentMetaSpr.sh = dy + dh;
        }

        if (angle || flipped) {
            graphics.push();
            graphics.translate(round(dx + dw / 2), round(dy + dh / 2));
            if (angle) graphics.rotate(angle);
            if (flipped) graphics.scale(-1, 1);
            graphics.image(img, floor(-dw / 2), floor(-dh / 2), dw, dh);
            graphics.pop();
        } else graphics.image(img, round(dx), round(dy), dw, dh);

        this.sprCPF++;
    }

    this.setSpriteSheet = (ID) => {
        this.sprDataID = ID;
        if (typeof window[ID] === 'string') window[ID] = uncompress(window[ID]);
        this.sprData = window[ID];
    }

    // --- textRenderer ---

    this.cursor = { x: 0, y: 0, c: 0 }

    this.put = (str, X, Y, c) => {
        let fontW = 8;
        let fontH = 8;
        let chars = str.split('');

        let ID = this.sprDataID;
        this.setSpriteSheet('FNT');

        if (typeof X === 'undefined') X = this.cursor.x;
        else this.cursor.x = X;
        if (typeof Y === 'undefined') Y = this.cursor.y;
        else this.cursor.y = Y;
        if (typeof c === 'undefined') c = this.cursor.c;
        else this.cursor.c = c;

        let x = X;
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] == '\n') {
                Y += 9, x = X;
                continue;
            } else if (chars[i] == '\t' || chars[i] == ' ') {
                x += fontH;
                continue;
            }

            let index = chars[i].charCodeAt() - 32;
            let sx = Math.floor(index % 32) * fontW;
            let sy = Math.floor(index / 32) * fontH;

            if (index < 0 || index >= 96) continue;

            this.palset(c);
            this.spr([sx, sy], x, Y, 8, 8);
            x += fontW;
        }

        this.cursor.y = Y + fontH;
        this.setSpriteSheet(ID);
    }

    this.rect = (x, y, w, h) => {
        let graphics = this.buffer[this.currentLayer];
        graphics.hasChanged = true;
        graphics.push();
        graphics.noFill();
        graphics.stroke(PAL[this.currentPal[0]]);
        graphics.rect(floor(x) + 0.5, floor(y) + 0.5, floor(w) - 1, floor(h) - 1);
        graphics.pop();
    }

    this.fillRect = (x, y, w, h) => {
        let graphics = this.buffer[this.currentLayer];
        graphics.hasChanged = true;
        graphics.push();
        graphics.noStroke();
        graphics.fill(PAL[this.currentPal[0]]);
        graphics.rect(floor(x), floor(y), floor(w), floor(h));
        graphics.pop();
    }

}

// --- utilities ---

function setColorAtIndex(img, x, y, clr) {
    let idx = 4 * (x + y * img.width);
    let pix = img.pixels;
    pix[idx] = red(clr);
    pix[idx + 1] = green(clr);
    pix[idx + 2] = blue(clr);
    pix[idx + 3] = alpha(clr);
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

Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});

var FNT = "@b!2@4!2@!2@3!2@!2@4!2@e!3@4!2@8!2@4!2@O!2@3!3@6!2@4!5@3!6@4!3@2!6@4!4@2!7@2!5@3!5@l!2@c!2@6!4@d!4@3!2@!2@3!2@!2@3!5@2!2@3!2@2!2@!2@3!2@7!2@6!2@5!2@2!2@3!2@w!2@3!@2!2@4!3@3!2@3!2@5!2@4!4@2!2@7!2@5!2@3!2@!2@3!2@!2@3!2@3!2@6!2@6!2@e!2@4!2@2!2@c!4@3!2@!2@2!7@!2@6!2@2!2@4!3@3!2@7!2@8!2@5!4@4!2@v!2@3!2@3!2@4!2@7!3@4!2@4!2@!2@2!6@2!2@a!2@2!2@3!2@!2@3!2@3!2@6!2@5!2@5!6@5!2@7!2@c!4@b!2@!2@3!4@6!2@4!3@!2@a!2@8!2@3!e@a!6@c!2@4!2@3!2@4!2@5!4@4!4@2!2@2!2@7!2@!6@5!2@4!5@3!6@h!2@i!2@5!2@e!2@b!7@5!2@4!2@4!2@!3@b!2@8!2@5!4@4!2@t!2@5!2@3!2@4!2@4!4@8!2@!7@6!2@!2@3!2@3!2@4!2@3!2@6!2@i!2@g!2@5!2@f!2@c!2@!2@2!5@4!2@2!2@!2@2!2@c!2@6!2@5!2@2!2@3!2@6!2@e!2@4!2@7!2@2!@5!2@3!3@5!2@3!2@5!2@2!2@3!2@!2@3!2@3!2@4!2@3!2@5!2@4!2@6!2@6!2@4!6@4!2@B!2@!2@4!2@4!2@3!2@2!3@!2@c!2@4!2@n!2@e!2@4!@9!3@4!6@!7@2!5@6!2@3!5@3!5@4!2@5!5@3!4@5!2@6!2@7!2@c!2@7!2@f!2@k1!2@S1!2@C!5@4!3@3!6@4!4@2!5@3!7@!7@3!5@!2@3!2@2!6@4!4@!2@3!2@2!2@5!2@3!2@!2@3!2@2!5@2!6@3!5@2!6@3!4@4!6@!2@3!2@!2@3!2@!2@3!2@!2@3!2@2!2@2!2@!7@2!4@3!2@7!4@6!@c!2@3!2@2!2@!2@2!2@3!2@2!2@2!2@!2@2!2@2!2@6!2@7!2@5!2@3!2@4!2@8!2@!2@2!2@3!2@5!3@!3@!3@2!2@!2@3!2@!2@3!2@!2@3!2@!2@3!2@!2@2!2@5!2@3!2@3!2@!2@3!2@!2@3!2@!3@!3@2!2@2!2@5!3@2!2@6!2@8!2@5!3@b!2@!4@!2@3!2@!2@3!2@!2@6!2@3!2@!2@6!2@6!2@6!2@3!2@4!2@8!2@!2@!2@4!2@5!7@!4@!2@!2@3!2@!2@3!2@!2@3!2@!2@3!2@!2@9!2@3!2@3!2@!2@3!2@!2@!@!2@2!5@3!2@2!2@4!3@3!2@7!2@7!2@4!2@!2@a!2@!4@!2@3!2@!6@2!2@6!2@3!2@!6@2!6@2!2@2!3@!7@4!2@8!2@!4@5!2@5!7@!7@!2@3!2@!2@3!2@!2@3!2@!2@2!3@2!5@5!2@3!2@3!2@!3@!3@!7@3!3@5!4@4!3@4!2@8!2@6!2@3!2@3!2@9!2@!4@!7@!2@3!2@!2@6!2@3!2@!2@6!2@6!2@3!2@!2@3!2@4!2@3!2@3!2@!5@4!2@5!2@!@!2@!2@!4@!2@3!2@!6@2!2@!4@!5@8!2@4!2@3!2@3!2@2!5@2!7@2!5@5!2@4!3@5!2@9!2@5!2@j!2@6!2@3!2@!2@3!2@2!2@2!2@!2@2!2@2!2@6!2@7!2@2!2@!2@3!2@4!2@3!2@3!2@!2@!3@3!2@5!2@3!2@!2@2!3@!2@3!2@!2@6!2@2!2@2!2@!3@2!2@3!2@4!2@3!2@3!2@3!3@3!3@!3@!3@!3@4!2@3!3@6!2@a!2@4!2@k!4@3!2@3!2@!6@4!4@2!5@3!7@!2@8!5@!2@3!2@2!6@2!5@2!2@2!3@2!6@!2@3!2@!2@3!2@2!5@2!2@7!4@!@!2@2!3@2!5@5!2@4!5@5!@4!2@3!2@!2@3!2@4!2@3!7@2!4@9!@2!4@b4!8@2!2@d!2@i!2@d!3@a!2@m!2@8!2@Z!2@T!3@5!2@3!3@6!3@!2@b!2@d!2@i!2@c!2@c!2@8!2@8!2@2!2@8!2@Z!2@S!2@7!2@5!2@4!2@!3@5!@7!2@5!4@3!5@4!5@3!5@3!4@5!2@5!5@2!2@m!2@3!@4!2@4!3@!2@2!5@4!4@3!5@4!5@2!2@!3@3!4@2!6@3!2@2!2@2!2@2!2@2!2@3!2@!2@3!2@!2@2!2@2!6@3!2@7!2@5!2@e!3@c!2@2!2@2!2@2!2@2!2@6!2@2!2@2!2@2!2@2!6@2!2@2!2@2!5@5!2@8!2@2!2@2!@5!2@4!2@!@!2@!2@2!2@2!2@2!2@2!2@2!2@2!2@2!2@2!3@5!@8!2@5!2@2!2@2!2@2!2@2!2@!@!2@2!2@!2@2!2@2!2@5!2@2!3@g!3@b!2@!2@b!2@2!2@2!2@2!2@2!2@6!2@2!2@2!6@4!2@4!2@2!2@2!2@2!2@4!2@8!2@2!2@!@6!2@4!2@!@!2@!2@2!2@2!2@2!2@2!2@2!2@2!2@2!2@2!2@7!4@4!2@5!2@2!2@2!2@2!2@2!2@!@!2@3!3@4!@!2@5!2@5!2@7!2@5!2@c!2@3!2@a!2@2!2@2!2@2!2@2!2@6!2@2!2@2!2@8!2@5!5@2!2@2!2@4!2@8!2@2!5@5!2@4!2@!@!2@!2@2!2@2!2@2!2@2!5@4!5@2!2@a!2@3!2@5!2@2!2@3!@2!@3!2@!@!2@2!2@!2@4!2@5!2@6!2@7!2@5!2@c!2@3!2@b!3@!2@!5@4!5@3!5@3!5@4!2@8!2@2!2@2!2@4!2@4!2@2!2@2!2@2!2@4!2@4!2@!@!2@!2@2!2@3!4@3!2@a!2@2!2@6!5@5!3@4!4@5!2@5!2@!2@2!2@3!2@2!2@5!6@4!3@5!2@3!3@d!7@X!4@k!4@H!2@a!2@W!2@Rw"
