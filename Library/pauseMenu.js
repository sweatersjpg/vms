

function PauseMenu() {
    paused = this;
    let g = createGraphics(400, 240);
    g.noSmooth();
    g.pixelDensity(1);
    R.currentLayer = g;

    let title = "PAUSED (press esc)"

    let ohistory = [];
    let thistory = [];

    let options = {
        "RESUME": () => {
            paused = false;
        },
        "RESTART": () => {
            ohistory.push(options);
            thistory.push(title);
            title = "Are you sure?";
            options = {
                "YES": () => {
                    // window.location.reload();
                    main = new Game();
                    paused = false;
                },
                "F*CK GO BACK": () => {
                    options = ohistory.pop();
                    title = thistory.pop();
                }
            }
        },
        "DEBUG": () => {
            ohistory.push(options);
            thistory.push(title);
            title = "Set debug mode to [" + !DEBUG + "]?";
            options = {
                "YES": () => {
                    DEBUG = !DEBUG;
                    options = ohistory.pop();
                    title = thistory.pop();
                },
                "BACK": () => {
                    options = ohistory.pop();
                    title = thistory.pop();
                }
            }
        }
    }

    // if (!main.nextScene || !main.scene) delete options["CHECKPOINT"];

    let selection = 0;
    this.display = () => {
        g.clear();

        g.push();
        g.noStroke();
        g.fill(0, 128);
        g.rect(0, 0, 400, 240);
        g.pop();

        let x = 32;
        let y = 64;

        g.fill(PAL[0]);
        g.noStroke();
        g.rect(0.5, y - 4.5, 400, 28 + Object.keys(options).length * 10);

        R.put(title, x, y, 22);
        y += 20;

        let i = 0;
        for (const key in options) {
            let s = " " + key;
            if (i == selection) s = ">" + s;
            R.put(s, x, y + i * 10, 22);
            i++;
        }

        if (btn.down && !pbtn.down) {
            selection++;
            if (selection >= i) selection = 0;
        }
        if (btn.up && !pbtn.up) {
            selection--;
            if (selection < 0) selection = i - 1;
        }
        if (btn.a && !pbtn.a) {
            options[Object.keys(options)[selection]]();
            selection = 0;
        }

        image(g, 0, 0, width, height);
    }
}