import * as PIXI from 'pixi.js';

export default function createFont(color, size, weight, thickness) {
  return new PIXI.TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: size,
    fontWeight: weight,
    wordWrap: true,
    wordWrapWidth: window.innerHeight * .6,
    stroke: '#000000',
    strokeThickness: thickness,
    style: {fill: color}
  });
}

// export const boldP2 = new PIXI.TextStyle({
//     fontFamily: 'Press Start 2P',
//     fontSize: window.innerHeight * .03,
//     fontWeight: 'bold',
//     wordWrap: true,
//     wordWrapWidth: window.innerHeight * .6
//   });
  
// export const regP2 = new PIXI.TextStyle({
//     fontFamily: 'Press Start 2P',
//     fontSize: window.innerHeight * .02,
//     // style: {fill: 0xFF0000}
// });