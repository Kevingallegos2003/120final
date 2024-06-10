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
        //player bullet variables
        this.bulletSpeed = 3.5;
        my.sprite.bullet = [];
        my.sprite.lbullet = [];
        this.space = null;
        this.playerfliped = false; //Used to know which way to shoot bullet at directions based on which way player faces
        //enemy variables
        my.sprite.flyenemies = [];
        my.sprite.enemies = [];
        my.sprite.ebulletsL = [];//for regular enemies, these move on x axis
        my.sprite.ebulletsR = [];//the enemy bullets that shoot right
        my.sprite.fbullets = [];//for flying enemies, these move on y axis
        this.maxbullets =6;
        this.possX = [108,306,360,684,684,522,594,234,657,180];
        this.possY = [108,72,198,234,108,126,126,216,234,54];
        this.oobposs = [730,735,745,750,760,755,725,745,735,760]; //X cords for out of bounds spawning for birds
        this.taken = [];
        this.po = 0;
        //player data
        this.myHealth = 100;
        this.myScore = 0;
        this.waves = 1;

        this.footstepSound = this.sound.add("footsteps");
        this.walking = false;
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
        //spike collision detection
        this.physics.add.collider(my.sprite.player, this.spikeLayer, () => {
            this.myHealth = 0;
        });
        this.spikeLayer.setCollisionByProperty({
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
        //FLYING RATS TIME -push up to 5 flying enemies
        for(var x = 0; x<5;x++){
            this.po = Math.floor(Math.random() * 9) + 1;
            if(this.taken.indexOf(this.po)==-1){
                this.taken.push(this.po);
                my.sprite.flyenemy = this.physics.add.sprite(this.oobposs[this.po], this.possY[this.po],"benemy").setScale(1);
                my.sprite.flyenemy.body.setImmovable(true);
                my.sprite.flyenemy.body.setAllowGravity(false);
                //this.physics.add.collider(my.sprite.enemy, this.groundLayer);
                my.sprite.flyenemies.push(my.sprite.flyenemy);
                my.sprite.flyenemy.anims.play("enemyFly", true);
            }
        }
        this.taken =[];

        //cursor key inputs
        cursors = this.input.keyboard.createCursorKeys();

        //setting the camera mechanics
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1.5);

        //hp text
        this.healthIcon = this.add.sprite(my.sprite.player.x, 50, "health");
        this.healthText = this.add.text(my.sprite.player.x, 100, this.myHealth, {fontFamily: "Stencil Std, fantasy", fontSize: 10});

        //score text
        this.scoreIcon = this.add.sprite(my.sprite.player.x, 50, "score");
        this.scoreText = this.add.text(my.sprite.player.x, 100, this.myScore, {fontFamily: "Stencil Std, fantasy", fontSize: 10});

        this.waveText = this.add.text(my.sprite.player.x, 150, "Wave: " + this.waves, {fontFamily: "Stencil Std, fantasy", fontSize: 20});

        this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        this.physics.world.debugGraphic.clear()

        //walking particle system
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ["fire_01.png", "fire_02.png"],
            scale: {start: 0.03, end: 0.04},
            random: true,
            lifespan: 400,
            maxAliveParticles: 15,
            alpha: {start: 1, end: 0.1},
            gravityY: -100
        });
        my.vfx.walking.stop();
    }

    update() {
        console.log(this.myScore);
        this.num = Math.floor(Math.random() * 720) + 1;//random number generator used for randomizing bullet shooting from enemies
        //console.log("len "+my.sprite.flyenemies.length);
        //UI text that follows player
        //hp
        this.healthText.x = my.sprite.player.body.position.x + 10;
        this.healthText.y = my.sprite.player.body.position.y - 16;
        this.healthIcon.x = my.sprite.player.body.position.x;
        this.healthIcon.y = my.sprite.player.body.position.y - 10;
        //score
        this.scoreText.x = my.sprite.player.body.position.x + 10;
        this.scoreText.y = my.sprite.player.body.position.y - 36;
        this.scoreIcon.x = my.sprite.player.body.position.x;
        this.scoreIcon.y = my.sprite.player.body.position.y - 30;
        //wave count
        this.waveText.x = my.sprite.player.body.position.x - 6;
        this.waveText.y = my.sprite.player.body.position.y - 60;

        //if player dies, go to game over screen
        if (this.myHealth <= 0) {
            this.sound.stopAll();
            this.sound.play("lose");
            this.scene.start("gameOver", this.waves-1);//Pass on "this.waves" to gameover scene
            //Depends on how you would like to decribe it, lets say u die on wave 1, u survived 0 waves due to the above statement,
            //"this.waves-1", feel free to change it!
        }

        //this.num =  Math.floor(Math.random() * 40) + 1;//random number generator
        //console.log(my.sprite.bullet.length);
        //bullet creation and movement
        if(Phaser.Input.Keyboard.JustDown(this.space)){
            console.log("bullet press working");
            this.sound.play("bulletSound", {volume: 0.7});
            if(!this.playerfliped){
                my.sprite.bull= this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2),"bullet").setImmovable(true);
                my.sprite.bull.body.setAllowGravity(false);
                my.sprite.bull.setScale(0.5);
                //this.physics.add.collider(my.sprite.bull, this.groundLayer);
                my.sprite.bullet.push(my.sprite.bull);
            }
            else{
                my.sprite.bull= this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y-(my.sprite.player.displayHeight/2),"bullet").setImmovable(true);
                my.sprite.bull.body.setAllowGravity(false);
                my.sprite.bull.setScale(0.5);
                my.sprite.lbullet.push(my.sprite.bull);
            }
        }
        //enemies flying from side to side
        for(let bird of my.sprite.flyenemies){
            if(bird.x > -10){bird.x-=2;}
            else{
                bird.x = 740;
                //if(bird.x > 765){bird.x = 750}
            }
            if(this.num == Math.floor(bird.x) || this.num == Math.floor(bird.y)){
                if(my.sprite.fbullets < 8){
                    //console.log("airdrop");
                    my.sprite.fbull = this.physics.add.sprite(bird.x, bird.y, "ebullet").setImmovable(true);
                    my.sprite.fbull.body.setAllowGravity(false);
                    my.sprite.fbull.setScale(0.5);
                    my.sprite.fbullets.push(my.sprite.fbull);
                }
            }
        }
        //ground enemy bullets moving to left
        for (let bullet of my.sprite.ebulletsR) {
            bullet.x += this.bulletSpeed;
        }
        //ground enemy bullets moving to right
        for (let bullet of my.sprite.ebulletsL) {
            bullet.x -= this.bulletSpeed;
        }
        //flying enemy bullet movement
        for (let bullet of my.sprite.fbullets) {
            bullet.y += this.bulletSpeed;
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
                    this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion03").setScale(0.04).play("explosion");
                    this.sound.play("enemyDie", {volume: 3});
                    console.log("collides!");
                    bullet.x = 750;
                    enemy.x = 750;
                    this.myScore++;
                    this.updateScore();
                }
            }
            for (let bullet of my.sprite.lbullet) {
                if (this.collides(enemy, bullet)) {
                    this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion03").setScale(0.04).play("explosion");
                    this.sound.play("enemyDie", {volume: 3});
                    console.log("collides!");
                    bullet.x = -10;
                    enemy.x = 750;
                    this.myScore++;
                    this.updateScore();
                }
            }
        }
        //bullet collides with birds
        for (let enemy of my.sprite.flyenemies) {
            for (let bullet of my.sprite.bullet) {
                if (this.collides(enemy, bullet)) {
                    console.log("collides!");
                    this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion03").setScale(0.04).play("explosion");
                    this.sound.play("enemyDie", {volume: 3});
                    bullet.x = 750;
                    enemy.y = -10;
                    this.myScore++;
                    this.updateScore(); 
                }
            }
            for (let bullet of my.sprite.lbullet) {
                if (this.collides(enemy, bullet)) {
                    console.log("collides!");
                    this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion03").setScale(0.04).play("explosion");
                    this.sound.play("enemyDie", {volume: 3});
                    bullet.x = -10;
                    enemy.y = -10;
                    this.myScore++;
                    this.updateScore();  
                }
            }
        }
        //enemy touches player
        for (let enemy of my.sprite.enemies) {
            if (this.collides(enemy, my.sprite.player)) {
                console.log("damage taken!");
                this.myHealth--;
                this.updateHealth();
            }
        }
        for (let enemy of my.sprite.flyenemies) {
            if (this.collides(enemy, my.sprite.player)) {
                console.log("damage taken!");
                this.myHealth--;
                this.updateHealth();
            }
        }
        //player touches bullet
        for (let bullet of my.sprite.ebulletsL) {
            if (this.collides(bullet, my.sprite.player)) {
                console.log("damage taken!");
                bullet.y = 735;
                this.myHealth-=10;
                this.updateHealth();
            }
        }
        for (let bullet of my.sprite.ebulletsR) {
            if (this.collides(bullet, my.sprite.player)) {
                console.log("damage taken!");
                bullet.y = 735;
                this.myHealth-=10;
                this.updateHealth();
            }
        }
        //player touches flying bullet
        for (let bullet of my.sprite.fbullets) {
            if (this.collides(bullet, my.sprite.player)) {
                console.log("damage taken!");
                bullet.y = 735;
                this.myHealth-=10;
                this.updateHealth();
            }
        }
        //trackers for when to remove bullets/enemies from screen
        my.sprite.fbullets = my.sprite.fbullets.filter((bullet) => bullet.y < 370);
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x < 750);
        my.sprite.ebulletsR = my.sprite.ebulletsR.filter((bullet) => bullet.x < 750);
        my.sprite.ebulletsL = my.sprite.ebulletsL.filter((bullet) => bullet.x > -10);
        my.sprite.lbullet = my.sprite.lbullet.filter((bullet) => bullet.x > -10);
        my.sprite.enemies = my.sprite.enemies.filter((enemy) => enemy.x < 750);
        my.sprite.flyenemies = my.sprite.flyenemies.filter((enemy) => enemy.y > 0);

        let isMoving = false;

        //moving left and right controls
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            this.playerfliped = true;
            my.sprite.player.anims.play("walk", true);

            isMoving = true;

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/3, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 1);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            this.playerfliped = false;
            my.sprite.player.anims.play("walk", true);

            isMoving = true;

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth-22, my.sprite.player.displayHeight/3, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play("idle");
            my.vfx.walking.stop();
        }

        if (isMoving && !this.walking) {
            this.footstepSound.play({
                loop: true,
                volume: 0.3
            });
            this.walking = true; 
        } else if(!isMoving && this.walking) {
            this.footstepSound.stop();
            this.walking = false;
        }

        //jump mechanic
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play("jump");
            my.vfx.walking.stop();
            this.footstepSound.stop();
            this.walking = false;
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound", {volume: 0.7});
        }
        //enemy turns to player and attacks them if close enough
        for (let enemy of my.sprite.enemies) {
            if(my.sprite.player.x >enemy.x){
                enemy.setFlipX(true);
                if(Math.abs(my.sprite.player.x - enemy.x)<= 70 && Math.abs(my.sprite.player.y - enemy.y)<= 35){
                    this.bpos = Math.floor(Math.random() * 23)+1;
                    //console.log("Can it attack u?" + this.bpos % 5);
                    if(this.bpos%6== 0 ){
                        my.sprite.ebull = this.physics.add.sprite(enemy.x, enemy.y, "ebullet").setImmovable(true);
                        my.sprite.ebull.body.setAllowGravity(false);
                        my.sprite.ebull.setScale(0.5);
                        my.sprite.ebulletsR.push(my.sprite.ebull);
                    }
                }
            }
            else{
                enemy.setFlipX(false);
                if(Math.abs(my.sprite.player.x - enemy.x)<= 60 && Math.abs(my.sprite.player.y - enemy.y)<= 25){
                    this.bpos = Math.floor(Math.random() * 23)+1;
                    //console.log("Can it attack u?" + this.bpos % 5);
                    if(this.bpos% 6 == 0 ){
                        my.sprite.ebull = this.physics.add.sprite(enemy.x, enemy.y, "ebullet").setImmovable(true);
                        my.sprite.ebull.body.setAllowGravity(false);
                        my.sprite.ebull.setScale(0.5);
                        my.sprite.ebulletsL.push(my.sprite.ebull);
                    }
                }
            }
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
       //NEW WAVE
       if(my.sprite.enemies.length == 0 && my.sprite.flyenemies.length == 0){
        this.waves++;
        this.updateWaveText();
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
        for(var x = 0; x<5;x++){
            this.po = Math.floor(Math.random() * 9) + 1;
            if(this.taken.indexOf(this.po)==-1){
                this.taken.push(this.po);
                my.sprite.flyenemy = this.physics.add.sprite(this.oobposs[this.po], this.possY[this.po],"benemy").setScale(1);
                my.sprite.flyenemy.body.setImmovable(true);
                my.sprite.flyenemy.body.setAllowGravity(false);
                //this.physics.add.collider(my.sprite.enemy, this.groundLayer);
                my.sprite.flyenemies.push(my.sprite.flyenemy);
                my.sprite.flyenemy.anims.play("enemyFly", true);
            }
        }
        this.taken =[];
       }
        
    }
    collides(a, b) {//simple collision check
        //console.log(Math.abs(a.x - b.x));
        //console.log(Math.abs(a.y - b.y));
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        if (Math.abs(a.x - b.x) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    //score function
    updateScore() {
        this.scoreText.setText(this.myScore);
    }
    //health function
    updateHealth() {
        this.healthText.setText(this.myHealth);
    }

    updateWaveText() {
        this.waveText.setText("Wave: " + this.waves);
    }
}