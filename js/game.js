

var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        this.load.image('tiles', '/assets/map/spritesheet.png');
        
        // map in json format
        this.load.tilemapTiledJSON('map', '/assets/map/map.json');
        
        // our two characters
        this.load.spritesheet('player', '/assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
        // create the map
        var map = this.make.tilemap({ key: 'map' });
        
        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles');
        
        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        
        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);
        
        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });        

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        
        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        this.input.on('pointerdown', function (pointer)
        {
            //cursor.setVisible(true).setPosition(pointer.x, pointer.y);

            //this.physics.moveToObject(this.player, pointer, 240);

        }, this);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;
        
        // where the enemies will be
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }

        // add collider
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },
    onMeetEnemy: function(player, zone) {        
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // shake the world
        this.cameras.main.shake(300);
        
        // start battle 
    },
    onZoneHover: function(zone) {

    },
    update: function (time, delta)
    {
    //    this.controls.update(delta);
    
        this.player.body.setVelocity(0);

        if (this.pointer.isDown) {
            cx = this.player.x
            cy = this.player.y
            ex = this.pointer.x + this.cameras.main.scrollX
            ey = this.pointer.y + this.cameras.main.scrollY

            this.physics.moveTo(this.player, this.pointer.x + this.cameras.main.scrollX, this.pointer.y + this.cameras.main.scrollY, 80);
            
            dy = ey - cy
            dx = ex - cx

            theta = Math.atan2(dy, dx);
            theta *= 180 / Math.PI;

            if (theta >= 135 || theta <= -135)
            {
                this.player.anims.play('right', true);
                this.player.flipX = true;
            }
            else if (theta >= -45 && theta <= 45)
            {
                this.player.anims.play('left', true);
                this.player.flipX = false;
            }
            else if (theta <= -45 && theta >= -135)
            {
                this.player.anims.play('up', true);
            }
            else if (theta >= 45 && theta <= 135)
            {
                this.player.anims.play('down', true);
            }
        }
        else
            this.player.anims.stop();
    }
    
});

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 420,
    height: 300,
    zoom: 3,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);