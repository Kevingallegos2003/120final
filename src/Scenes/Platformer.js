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
        //enemy variables
        my.sprite.enemies = [];
        this.possX = [108,306,360,684,684,522,594,234,657,180];
        this.possY = [108,72,198,234,108,126,126,216,234,54];
        this.taken = [];
        this.po = 0;
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
        /*
        //spike layer
        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);
        */
        //I moved the spike layer as the last one rendered so the spikes are layer over the mushroom stems
        //This can be reverted if u want
        //extra background layer
        this.extraLayer = this.map.createLayer("Extras", this.tileset, 0, 0);
        //spike layer
        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);

        //creating player and player collision
        my.sprite.player = this.physics.add.sprite(1, 260, "player").setScale(this.SCALE);
        my.sprite.player.setCollideWorldBounds(true);
        //ground collision detection
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        //Enemies time -push up to 5 enemies at start -
        for(var x = 0; x<5;x++){
            this.po = Math.floor(Math.random() * 9) + 1;
            if(this.taken.indexOf(this.po)==-1){
                this.taken.push(this.po);
                my.sprite.enemy = this.physics.add.sprite(this.possX[this.po], this.possY[this.po],"enemy").setScale(this.SCALE);
                this.physics.add.collider(my.sprite.enemy, this.groundLayer);
                my.sprite.enemies.push(my.sprite.enemy);
                //this.physics.add.collider(my.sprite.enemy, this.groundLayer);
            }
            
        }
        
        this.taken =[];
        //this.physics.add.collider(my.sprite.enemy, this.groundLayer);

        //cursor key inputs
        cursors = this.input.keyboard.createCursorKeys();

        //setting the camera mechanics
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1.5);
    }

    update() {
        this.num =  Math.floor(Math.random() * 40) + 1;//random number generator
        //console.log(my.sprite.bullet.length);
        //bullet creation and movement
        if(Phaser.Input.Keyboard.JustDown(this.space)){
            console.log("bullet press working");
            this.sound.play("bulletSound", {volume: 0.7});
            if(!this.playerfliped){
                my.sprite.bull= this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2),"bullet").setImmovable(true);
                my.sprite.bull.body.setAllowGravity(false);
                //this.physics.add.collider(my.sprite.bull, this.groundLayer);
                my.sprite.bullet.push(my.sprite.bull);
            }
            else{
                my.sprite.bull= this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2),"bullet").setImmovable(true);
                my.sprite.bull.body.setAllowGravity(false);
                my.sprite.lbullet.push(my.sprite.bull);
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
        //Player Bullet collides with enemy
        for (let enemy of my.sprite.enemies) {
            for (let bullet of my.sprite.bullet) {
                if (this.collides(enemy, bullet)) {
                    console.log("collides!");
                    bullet.x = 750;
                    enemy.x = 750
                }
            }
            for (let bullet of my.sprite.lbullet) {
                if (this.collides(enemy, bullet)) {
                    console.log("collides!");
                    bullet.x = -10;
                    enemy.x = 750
                }
            }
        }


        //trackers for when to remove bullets/enemies from screen
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x < 750);
        my.sprite.lbullet = my.sprite.lbullet.filter((bullet) => bullet.x > -10);
        my.sprite.enemies = my.sprite.enemies.filter((enemy) => enemy.x < 750);
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
        //enemy movement WIP
        /*
        if(this.num % 2){
            this.steps = this.num;
            for(this.steps; this.steps>0; this.steps--){my.sprite.enemy.body.setAccelerationX(5);}
        }
        else if(this.num % 3){
            this.steps = this.num;
            for(this.steps; this.steps > 0; this.steps--){my.sprite.enemy.body.setAccelerationX(-5);}
        }
        else{my.sprite.enemy.body.setAccelerationX(0);}
        */
        
    }
    collides(a, b) {//simple collision check
        //console.log(Math.abs(a.x - b.x));
        //console.log(Math.abs(a.y - b.y));
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        if (Math.abs(a.x - b.x) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}