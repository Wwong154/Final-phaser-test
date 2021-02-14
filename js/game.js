class Title extends Phaser.Scene
{
    constructor ()
    {
        super();
    }
    static player = Phaser.Physics.Arcade.Sprite
    static overlap = true;

    preload () {
      this.load.tilemapTiledJSON("map", "map/temp.json")
      this.load.image('tile', 'tiles/season.png')
      this.load.spritesheet('fm_02', 'skins/fm_02.png', { frameWidth: 32, frameHeight: 32})
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    create ()
    { 
      this.map = this.make.tilemap({ key: "map" });
      //add stores object first. 
      let storesArea = this.map.getObjectLayer('Object Layer 1')['objects'];
      let storeAreaGroup = this.physics.add.staticGroup({});
      let i = 0;
      storesArea.forEach(area => {
      let a = storeAreaGroup.create(area.x, area.y);
          a.setScale(area.width/32, area.height/32);
          a.setOrigin(0); //to replace auto offset
          a.body.width = area.width; //body of the physics body
          a.body.height = area.height;
      });
      storeAreaGroup.refresh(); //physics body needs to refresh
      console.log(storeAreaGroup);

      //add other layer to overwrite obj layer
      this.tileset = this.map.addTilesetImage('b2a48f88a662593f2ed0ae2f609906a1_a20e10b34f8b9f083be0f1faf36b6f5d', 'tile')
      this.worldLayer = this.map.createLayer("world",this.tileset,0,0)
      this.wallLayer = this.map.createLayer("wall",this.tileset,0,0)
      this.wallLayer.setCollisionByProperty({ collides: true });

      //make sprite anime
      this.anims.create({
        key: 'idle-u',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [10]}),
      });
      this.anims.create({
        key: 'idle-d',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [1]}),
      });
      this.anims.create({
        key: 'idle-l',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [4]}),
      });
      this.anims.create({
        key: 'idle-r',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [7]}),
      });
      this.anims.create({
        key: 'walk-u',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [ 9, 10, 11 ] }),
        frameRate: 7,
        repeat: -1
      });
      this.anims.create({
        key: 'walk-d',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [ 0, 1, 2 ] }),
        frameRate: 7,
        repeat: -1
      });
      this.anims.create({
        key: 'walk-l',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [ 3, 4, 5 ] }),
        frameRate: 7,
        repeat: -1
      });
      this.anims.create({
        key: 'walk-r',
        frames: this.anims.generateFrameNumbers('fm_02', { frames: [ 6, 7, 8 ] }),
        frameRate: 7,
        repeat: -1
      });
      //add player sprite
      this.player = this.physics.add.sprite(400, 300, "fm_02")
      this.player.play('idle-d') // play idle-d as default 

      this.physics.add.overlap(this.player, storeAreaGroup, () => this.overlap = true, undefined, this); //check overlap with store area, change overlap to true

      this.physics.add.collider(this.player, this.wallLayer); //add collider to wallLayer with player
    }

    update () 
    {
      if(this.overlap === true && this.cursors.space.isDown) {
        // add ajax call
      }
      this.player.setVelocity(0);
      if (this.cursors.left.isDown)
      {
        this.player.setVelocityX(-200);
        if (this.player.anims.currentAnim.key === 'walk-l') {} 
        else if (this.cursors.up.isDown || this.cursors.down.isDown) 
        {} else {
          this.player.play('walk-l')
        }
      }
      else if (this.cursors.right.isDown)
      {
        this.player.setVelocityX(200);
        if (this.player.anims.currentAnim.key === 'walk-r') {} 
        else if (this.cursors.up.isDown || this.cursors.down.isDown) 
        {} else {
          this.player.play('walk-r')
        }
      }
      if (this.cursors.up.isDown)
      {
        this.player.setVelocityY(-200);
        if (this.player.anims.currentAnim.key === 'walk-u') {} 
        else {
          this.player.play('walk-u')
        }
      }
      else if (this.cursors.down.isDown)
      {
        this.player.setVelocityY(200);
        if (this.player.anims.currentAnim.key === 'walk-d') {} 
        else {
          this.player.play('walk-d')
        }
      }
      if (!this.cursors.down.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) {//if no arrow input, change to idle anime
        if (!this.player.anims.currentAnim.key.includes('idle')){
          let newAnim = this.player.anims.currentAnim.key.split('-')
          this.player.play("idle-" + newAnim[1])
        }
      }
      this.overlap = false; //update overlap check
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'Virtual Market',
    width: 1280,
    height: 960,
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scene: [ Title ]
};

const game = new Phaser.Game(config);