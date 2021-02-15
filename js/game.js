class Title extends Phaser.Scene
{
    constructor ()
    {
        super();
    }
    static player = Phaser.Physics.Arcade.Sprite
    static overlap = true;
    static inshop = false;

    preload () {
      this.load.tilemapTiledJSON("map", "map/temp.json")
      this.load.image('tile', 'tiles/season.png')
      this.load.spritesheet('fm_02', 'skins/fm_02.png', { frameWidth: 32, frameHeight: 32})
      this.cursors = this.input.keyboard.createCursorKeys();
      this.load.html('store_window', 'html/store_window.html');
    }

    create ()
    { 
      this.map = this.make.tilemap({ key: "map" });
      //add object layer first. 
      let storesArea = this.map.getObjectLayer('Object Layer 1')['objects'];
      let storeAreaGroup = this.physics.add.staticGroup({});
      let i = 0;
      storesArea.forEach(area => {
      let a = storeAreaGroup.create(area.x, area.y);
          a.setScale(area.width/32, area.height/32);
          a.setOrigin(0); //to replace auto offset
          a.body.width = area.width; //body of the physics body
          a.body.height = area.height;
          a.id = area.id //add store_id to do ajax call
      });
      storeAreaGroup.refresh(); //physics body needs to refresh
      console.log(storeAreaGroup.children.entries[0].id);//example of storeArea's id path

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

      //add camera
      this.cameras.main.setBounds(0, 0, 1280, 960); //set camera to size of map
      this.cameras.main.setZoom(3); //zoom in
      
      //add overlapArea detect
      this.physics.add.overlap(this.player, storeAreaGroup, (x) => {console.log(x);this.overlap = true;}, undefined, this); //check overlap with store area, change overlap to true

      //add collider with player
      this.physics.add.collider(this.player, this.wallLayer); 
    }

    update () 
    {
      this.cameras.main.centerOn(this.player.x, this.player.y); //set camera to the player
      if(this.inshop) { //when in shop stop
        this.cameras.main.setZoom(1); //while in shop, stay zoom out
        this.player.setVelocity(0); //no player movement allow
        return; //end update
      }
      if(this.overlap === true && this.cursors.space.isDown) {//if player is on interact area and press space
        let newAnim = this.player.anims.currentAnim.key.split('-') // change anime to idle
        this.player.play("idle-" + newAnim[1])
        if($("#store-data").length === 0){ // allow user to open 1 window only
          this.inshop = true //set inshop true, to 'pause' game
          this.cameras.main.setZoom(1); //zoom out cause phaser dom is weird
          this.add.dom(640, 480).createFromCache('store_window'); //place dom in center
        }
        $("#close-button").on("click", () => { 
            $("canvas").prev().children().remove() //remove the added dom
            this.inshop = false; //'unpause' game
        })
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
      this.cameras.main.setZoom(3);
      this.overlap = false; //update overlap check
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      width: 1280,
      height: 960,
      parent: "#game-container"
    },
    dom: {
        createContainer: true
    },
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