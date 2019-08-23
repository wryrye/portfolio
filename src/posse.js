
import * as PIXI from 'pixi.js';

export default class Posse {
    constructor(app, python) {
      this.stage = app.stage;
      this.resources = app.loader.resources;
      this.python = python;
      this.knights = [];
      
      this.addKnights();
      this.knightsRight();
      this.playKnights();
    }

    addKnights() {
      let sheet2 = this.resources.knight.spritesheet;
    
      for (let i = 0; i < 3; i++) {
        // create an animated sprite
        let knight = new PIXI.AnimatedSprite(sheet2.animations["knight"]);
    
        // configure + start animation:
        knight.position.set((i + 1) * window.innerHeight/7 - window.innerHeight, window.innerHeight * 8/10); // almost bottom-left corner of the canvas
        knight.animationSpeed = 0.25;
        knight.anchor.x = .5
        knight.anchor.y = .5
        knight.scale.x = 1
        knight.vx = 0
        knight.vy = 0
        knight.gotoAndStop(1);
    
        knight.width = window.innerHeight/2.2;
        knight.height = window.innerHeight/2.2;
    
        // add it to the stage and render!
        this.stage.addChild(knight);
        this.knights.push(knight)
      }
    }
    
    playKnights() {
      this.knights.forEach((knight, index) => {
        knight.play();
      });
    }
    
    stopKnights() {
      this.knights.forEach((knight, index) => {
        knight.gotoAndStop(1);
      });
    }
    
    moveKnights() {
      this.knights.forEach((knight, index) => {
        knight.x += this.python.vx;
        knight.y += this.python.vy
      });
    }
    
    knightsLeft() {
      this.knights.forEach((knight, index) => {
        if (knight.scale.x > 1) knight.scale.x *= -1;
      });
    }
    
    knightsRight() {
      this.knights.forEach((knight, index) => {
        if (knight.scale.x < 1) knight.scale.x *= -1;
      });
    }
  }