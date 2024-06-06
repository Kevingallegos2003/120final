class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        //character loader
        this.load.image("player", "tile_0000.png");

        //tilemap loader
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("platformer", "platformer_level.tmj");
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        
         this.scene.start("platformerScene");
    }

    update() {
    }
}