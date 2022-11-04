import * as PIXI from "pixi.js";
import createFont from "./fonts.js";

export default class Response {
  constructor(text, action, callback, color, thickness) {
    this.text = text;
    this.action = action;

    let textObj = new PIXI.Text(
      text,
      createFont(color, window.innerHeight * 0.03, "normal", thickness)
    );
    textObj.visible = false;
    textObj.interactive = true;
    textObj.style.fill = color;

    textObj.on("click", () => {
      this.action();
      callback();
    });

    this.textObj = textObj;
  }
}
