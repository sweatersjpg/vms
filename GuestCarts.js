var yourSpriteSheet = "sprite sheet data";

createGame(function (R) {
    R.setSpriteSheet("yourSpriteSheet"); // set sprite sheet

    // game variables here


    // starts the game
    let newGame = () => {
        // reset game variables here

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
        R.cls(1); // clear screen to black
        R.palset(22, 1); // set to basic palette

        // put title sprite here

        if (btn.b && !pbtn.b) newGame(); // if button pressed start new game
    }
    this.draw = this.title; // make draw loop the titlescreen

    // game loop
    this.game = () => {
        R.cls(1); // clear screen to black
        R.palset(22, 1); // set to basic palette

        // game logic and draw calls goes here

        if (btn.start && !pbtn.start) this.draw = this.pause; // if start button pressed, go to pause screen
    }

    // new classes go here

});