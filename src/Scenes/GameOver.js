class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("gameOverEnemy", "tile_0011.png");
        this.load.image("laughEnemy", "tile_0012.png");
    }

    create(waves) {
        //still need to figure out how to put your wave count from the previous scene into this
        this.waves = waves;
        if(typeof(this.waves)!="number"){this.waves = 0;}//prevents NULL var since it is wonky grabbing zeros for some reason
        this.add.text(50, 50, "You Died! You survived: " + this.waves + " waves", {
            fontFamily: "Stencil Std, fantasy",
            fontSize: 40
        });

        this.enemyScreen = this.add.sprite(360, 160, "gameOverEnemy").setScale(4);

        const playButton = this.add.text(300, 200, "Play Again", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#D86639"})
            .setInteractive()
            .on("pointerdown", () => this.scene.start("loadScene"))
            .on("pointerdown", () => this.sound.play("click"));

        //laughing enemy animation
        this.anims.create({
            key: "laugh",
            frames: [
                { key: "gameOverEnemy" },
                { key: "laughEnemy" },
            ],
            frameRate: 2,
            repeat: 1000,
        });
        this.enemyScreen.anims.play("laugh", true);
    
    }

    update() {
    }
}