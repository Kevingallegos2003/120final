class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        //platformer physics include: player acceleration, drag, jump velocity, world gravity, particle velocity, and character scale
        this.ACCELERATION = 550;
        this.DRAG = 1500;    
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -550;
        this.PARTICLE_VELOCITY = 20;
        this.SCALE = 0.7;
    }

    create() {
        this.map = this.add.tilemap("platformer", 16, 16, 40, 20);
        this.tileset = this.map.addTilesetImage("platformer_tilemap", "tilemap_tiles");
        //ground layer
        this.groundLayer = this.map.createLayer("Grounds-n-Platforms", this.tileset, 0, 0);
        //spike layer
        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);
        //extra background layer
        this.extraLayer = this.map.createLayer("Extras", this.tileset, 0, 0);

        //creating player and player collision
        my.sprite.player = this.physics.add.sprite(1, 260, "player").setScale(this.SCALE);
        my.sprite.player.setCollideWorldBounds(true);
        //ground collision detection
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //cursor key inputs
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        //moving left and right controls
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
        }

        //jump mechanic
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
    }
}