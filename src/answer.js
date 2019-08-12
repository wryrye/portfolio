import * as PIXI from 'pixi.js';
import * as Fonts from './fonts.js'

export default class Answer {
    constructor(text, action, callback) {
      this.text = text;
      this.action = action
  
      let textObj = new PIXI.Text(text, Fonts.regP2);
      textObj.visible = false;
      textObj.interactive = true;
  
      textObj.on('click', () => {
        this.action();
        callback();
      });
  
      this.textObj = textObj;
    }
  }