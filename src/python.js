
import * as PIXI from 'pixi.js';

export default class Python {
    constructor(app, resource) {
      this.stage = app.stage;
      this.animations = app.loader.resources[resource].spritesheet.animations;
      this.startX = window.innerHeight * .69 - window.innerHeight
      this.startY = window.innerHeight * .8;

      let sprite = new PIXI.AnimatedSprite(this.animations["snake_idle"]);
      sprite.width = sprite.height = window.innerHeight*1.3;
      sprite.position.set(this.startX, this.startY);
      sprite.anchor.set(0.5);
      sprite.animationSpeed = 0.3;
      sprite.scale.x = 1
      sprite.vx = 1
      sprite.vy = 0
      sprite.play();
      this.stage.addChild(sprite);
      this.sprite = sprite;
    }

    setAnimation(animation) {
        this.sprite.width = window.innerHeight*1.3;
        this.sprite.height = window.innerHeight*1.3;
        this.sprite.textures = this.animations[animation];
    }

    faceRight(velocity) {
        this.sprite.vx = velocity;
        this.sprite.scale.x = 1
        this.setAnimation("snake_run");
        this.sprite.play()
    }

    faceLeft(velocity) {
        this.sprite.vx = velocity * -1;
        this.sprite.scale.x = -1
        this.setAnimation("snake_run");
        this.sprite.play()
    }

    move() {
        this.sprite.x += this.sprite.vx;
    }

    stop() {
        this.sprite.vx = 0;
        this.setAnimation("snake_idle");
        this.sprite.play()
    }
  }