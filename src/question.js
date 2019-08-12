import * as PIXI from 'pixi.js';
import * as Fonts from './fonts.js'

export default class Question {
    constructor(text, answers) {
      this.text = text;
      this.answers = answers;
  
      let textObj = new PIXI.Text(text, Fonts.boldP2);
      textObj.position.set(1500, window.innerHeight - 750);
      textObj.visible = false;
      this.textObj = textObj;
  
      answers.forEach((answer, index) => {  
        answer.textObj.on('mouseover', () => {
          this.triangle.x = answer.textObj.x -25;
          this.triangle.y = answer.textObj.y;
        });
  
        answer.textObj.position.set(1500, window.innerHeight - (680 - index * 35));
        // app.stage.addChild(answer.textObj);
      });
  
      let triangle = new PIXI.Graphics();
      triangle.visible = false;
  
      triangle.x = this.answers[0].textObj.x -25;
      triangle.y = this.answers[0].textObj.y;
    
      var triangleWidth = 15,
          triangleHeight = triangleWidth,
          triangleHalfway = triangleWidth/2;
    
      triangle.beginFill(0x000000, 1);
      triangle.lineStyle(0, 0xFF0000, 1);
      triangle.moveTo(0, triangleHeight);
      triangle.lineTo(triangleWidth, triangleHalfway); 
      triangle.lineTo(0, 0);
      triangle.lineTo(0, triangleWidth);
      triangle.endFill();
    
      triangle.interactive = true;
      triangle.buttonMode = true;
      triangle.on("pointertap", function(e) {
        console.log(e);
      });
    
      this.triangle = triangle;
    }
  
    attach(app) {
      app.stage.addChild(this.textObj);
      app.stage.addChild(this.triangle);
      this.answers.forEach((answer) => {
        app.stage.addChild(answer.textObj);
      });
    }
  
    remove() {
      this.textObj.destroy();
      this.triangle.destroy();
      this.answers.forEach((answer) => {
        answer.textObj.destroy();
      });
    }

    show() {
      this.textObj.visible = true;
      this.triangle.visible = true;
      this.answers.forEach((answer, index) => {
        answer.textObj.visible = true;
      });
    }

    hide() {
      this.textObj.visible = false;
      this.triangle.visible = false;
      this.answers.forEach((answer, index) => {
        answer.textObj.visible = false;
      });
    }
  }