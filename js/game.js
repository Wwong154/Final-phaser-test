class Title extends Phaser.Scene
{
    constructor ()
    {
        super();
    }


    static player = Phaser.Physics.Arcade.Sprite

    preload () {
      this.cameras.main.setBounds(0, 0, 1024, 2048);
      this.load.image('sky', 'backgrounds/sky.png')
      this.load.spritesheet('fm_02', 'skins/fm_02.png', { frameWidth: 32, frameHeight: 32})
    }
    create ()
    {   
      this.add.image(400, 300, 'sky');    
      this.cursors = this.input.keyboard.createCursorKeys();
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
      this.player = this.physics.add.sprite(400, 300, "fm_02")
      this.player.play('idle-d')
    }

    update () 
    {
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
      if (!this.cursors.down.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) {
        this.player.setVelocity(0);
        if (!this.player.anims.currentAnim.key.includes('idle')){
          let newAnim = this.player.anims.currentAnim.key.split('-')
          this.player.play("idle-" +newAnim[1])
        }
      }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'Virtual Market',
    width: 800,
    height: 600,
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