import * as PIXI from "pixi.js";

export default function createFont(color, size, weight, thickness) {
  return new PIXI.TextStyle({
    fontFamily: "Press Start 2P",
    fontSize: size,
    fontWeight: weight,
    wordWrap: true,
    wordWrapWidth: window.innerHeight * 0.9,
    stroke: "#000000",
    strokeThickness: thickness,
    fill: color,
  });
}
