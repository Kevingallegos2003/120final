class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 450;
        this.DRAG = 2500;    
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -450;
        this.PARTICLE_VELOCITY = 20;
    }

    create() {
        this.map = this.add.tilemap("platformer", 16, 16, 540, 120);
        this.tileset = this.map.addTilesetImage("platformer_tilemap", "tilemap_tiles");
        //ground layer
        this.groundLayer = this.map.createLayer("Grounds-n-Platforms", this.tileset, 0, 0);
        //spike layer
        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);
        //extra background layer
        this.extraLayer = this.map.createLayer("Extras", this.tileset, 0, 0);

    }

    update() {
       
    }
}