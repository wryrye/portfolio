
import * as PIXI from 'pixi.js';

export default class Posse {
    constructor(app, leader, follower) {
      this.stage = app.stage;
      this.resources = app.loader.resources;
      this.python = leader;
      this.members = [];
      
      this.addMembers();
      this.faceRight();
      this.play();
    }

    addMembers() {
      for (let i = 0; i < 3; i++) {
        let member = new PIXI.AnimatedSprite(this.resources["knight"].spritesheet.animations["knight"]);    
        member.position.set((i + 1) * window.innerHeight/7 - window.innerHeight, window.innerHeight * 8/10);
        member.animationSpeed = 0.25;
        member.anchor.x = .5
        member.anchor.y = .5
        member.scale.x = 1
        member.vx = 0
        member.vy = 0
        member.width = window.innerHeight/2.2;
        member.height = window.innerHeight/2.2;
        member.gotoAndStop(1);
    
        this.stage.addChild(member);
        this.members.push(member)
      }
    }
    
    play() {
      this.members.forEach((member, index) => {
        member.play();
      });
    }
    
    stop() {
      this.members.forEach((member, index) => {
        member.gotoAndStop(1);
      });
    }
    
    move() {
      this.members.forEach((member, index) => {
        member.x += this.python.vx;
        member.y += this.python.vy
      });
    }
    
    faceLeft() {
      this.members.forEach((member, index) => {
        if (member.scale.x > 1) member.scale.x *= -1;
        this.play();
      });
    }
    
    faceRight() {
      this.members.forEach((member, index) => {
        if (member.scale.x < 1) member.scale.x *= -1;
        this.play();
      });
    }
  }