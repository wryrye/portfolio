import * as PIXI from "pixi.js";

export default class Posse {
  constructor(app, leader, follower) {
    this.stage = app.stage;
    this.resources = app.loader.resources;
    this.leader = leader;
    this.follower = follower;
    this.followers = [];

    this.addFollowers();
    this.faceRight();
    this.play();
  }

  addFollowers() {
    for (let i = 0; i < 3; i++) {
      let follower = new PIXI.AnimatedSprite(
        this.resources[this.follower].spritesheet.animations[this.follower]
      );
      follower.position.set(
        ((i + 1) * window.innerHeight) / 7 - window.innerHeight,
        (window.innerHeight * 8) / 10
      );
      follower.animationSpeed = 0.25;
      follower.anchor.set(0.5);
      follower.scale.x = 1;
      follower.width = window.innerHeight / 2.2;
      follower.height = window.innerHeight / 2.2;
      follower.gotoAndStop(1);

      this.stage.addChild(follower);
      this.followers.push(follower);
    }
  }

  play() {
    this.followers.forEach((follower, index) => {
      follower.play();
    });
  }

  stop() {
    this.followers.forEach((follower, index) => {
      follower.gotoAndStop(1);
    });
  }

  move(delta) {
    this.followers.forEach((follower, index) => {
      follower.x += delta * this.leader.vx * 2;
    });
  }

  faceLeft() {
    this.followers.forEach((follower, index) => {
      if (follower.scale.x > 1) follower.scale.x *= -1;
      this.play();
    });
  }

  faceRight() {
    this.followers.forEach((follower, index) => {
      if (follower.scale.x < 1) follower.scale.x *= -1;
      this.play();
    });
  }
}
