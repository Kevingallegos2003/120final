class Title extends Phaser.Scene {
    constructor() {
        super("title");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "tile_0000.png");
        this.load.image("enemy1", "tile_0008.png");
        this.load.image("enemy2", "tile_0009.png");
        this.load.image("enemy3", "tile_0024.png");

        this.load.audio("click", "select_008.ogg");
    }

    create() {
        this.add.text(150, 50, "Jump Shoot Kill Jump", {
            fontFamily: "Stencil Std, fantasy",
            fontSize: 50
        });

        //button for platformer loader scene
        const playButton = this.add.text(335, 150, "Play", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#D86639"})
            .setInteractive()
            .on("pointerdown", () => this.scene.start("loadScene"))
            .on("pointerdown", () => this.sound.play("click"));
        //button for credits scene
        const creditsButton = this.add.text(316, 200, "Credits", {fontFamily: "Stencil Std, fantasy", fontSize: 30, fill: "#D99D3A"})
            .setInteractive()
            .on("pointerdown", () => this.scene.start("credits"))
            .on("pointerdown", () => this.sound.play("click"));

        this.add.sprite(200, 200, "player").setScale(4);
        this.add.sprite(550, 200, "enemy1").setScale(4);
        this.add.sprite(480, 200, "enemy2").setScale(3);
        this.add.sprite(610, 200, "enemy3").setScale(3);
    }

    update() {
    }
}