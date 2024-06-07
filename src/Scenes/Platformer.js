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
        //bullet variables
        this.bulletSpeed = 3.5;
        my.sprite.bullet = [];
        my.sprite.lbullet = [];
        this.space = null;
        this.playerfliped = false; //Used to know which way to shoot bullet at directions based on which way player faces
    }

    create() {
        //reset sounds and play background music
        this.game.sound.stopAll();
        this.sound.play("music", {
            volume: 0.3,
            loop: true
        });

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

        //setting the camera mechanics
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1.5);
    }

    update() {
        //console.log(my.sprite.lbullet.length);
        //bullet creation and movement
        if(Phaser.Input.Keyboard.JustDown(this.space)){
            console.log("bullet press working");
            this.sound.play("bulletSound", {volume: 0.7});
            if(!this.playerfliped){
                my.sprite.bullet.push(this.add.sprite(my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet"));
            }
            else{
                my.sprite.lbullet.push(this.add.sprite(my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2), "bullet"));
            }
        }
        //bullets appearing on right side
        for (let bullet of my.sprite.bullet) {
            bullet.x += this.bulletSpeed;
        }
        //bullets appearing on left side
        for (let bullet of my.sprite.lbullet) {
            bullet.x -= this.bulletSpeed;
        }

        //trackers for when to remove bullet from screen
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x < 750);
        my.sprite.lbullet = my.sprite.lbullet.filter((bullet) => bullet.x > -10);

        //moving left and right controls
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            this.playerfliped = true;
        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
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