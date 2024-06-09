class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        //sprite loader
        this.load.image("player", "tile_0000.png");
        this.load.image("walking", "tile_0001.png");
        this.load.image("bullet", "tile_0007.png");
        this.load.image("enemy", "tile_0009.png");
        this.load.image("benemy", "tile_0024.png");
        this.load.image("health", "tile_0044.png");
        this.load.image("score", "tile_0151.png");

        //tilemap loader
        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("platformer", "platformer_level.tmj");
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        //particle loader
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //audio loader
        this.load.audio("bulletSound", "footstep_grass_002.ogg");
        this.load.audio("footsteps", "footstep_carpet_002.ogg");
        this.load.audio("jumpSound", "drop_004.ogg");
        this.load.audio("music", "Voxel Revolution.mp3");
        this.load.audio("lose", "jingles_PIZZI01.ogg");
    }

    create() {
        console.log("loading game...");
        //walking animation
        this.anims.create({
            key: "walk",
            frames: [
                { key: "walking" },
                { key: "player" },
            ],
            frameRate: 15,
            repeat: 5,
        });
        //idle frame
        this.anims.create({
            key: "idle",
            frames: [
                { key: "player" },
            ]
        });
        //jump frame
        this.anims.create({
            key: "jump",
            frames: [
                { key: "walking"},
            ]
        });

        this.scene.start("platformerScene");
    }

    update() {
    }
}