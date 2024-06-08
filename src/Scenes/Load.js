class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        //sprite loader
        this.load.image("player", "tile_0000.png");
        this.load.image("bullet", "tile_0008.png");
        this.load.image("enemy", "tile_0009.png");

        //tilemap loader
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("platformer", "platformer_level.tmj");
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        //audio loader
        this.load.audio("bulletSound", "footstep_grass_002.ogg");
        this.load.audio("music", "Voxel Revolution.mp3");
    }

    create() {
        console.log("loading game...");
        this.scene.start("platformerScene");
    }

    update() {
    }
}