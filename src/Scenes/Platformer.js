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
        //------Bullet variables-----
        this.bulletSpeed = 2;
        my.sprite.bullet = [];
        my.sprite.lbullet = [];
        this.space = null;
        this.playerfliped = false;//Used to know which way to shoot bullet at directions based on which way player faces
    }

    create() {
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
        console.log(my.sprite.lbullet.length);

        //bullet creation and movement
        if(Phaser.Input.Keyboard.JustDown(this.space)){
            //console.log("urmom");
            if(!this.playerfliped){
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "player","tile_0000.png")
                );
            }
            else{
                my.sprite.lbullet.push(this.add.sprite(
                    my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "player","tile_0000.png")
                );
            }
        }
        for (let bullet of my.sprite.bullet) {//right bullets
            bullet.x += this.bulletSpeed;
        }
        for (let bullet of my.sprite.lbullet) {//left bullets
            bullet.x -= this.bulletSpeed;
        }
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x < 750);//bullet removal
        my.sprite.lbullet = my.sprite.lbullet.filter((bullet) => bullet.x > -10);//bullet removal
        //moving left and right controls
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            this.playerfliped = true;
        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            this.playerfliped = false;
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