class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        //sprite loader
        //this.load.atlas("characters", "tilemap-characters_packed.png", "tilemap-characters-packed.json")

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