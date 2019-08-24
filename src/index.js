import * as PIXI from 'pixi.js';
import Keyboard from './keyboard.js'
import Speech from './speech.js'
import Response from './response.js'
import Python from './python.js'
import Posse from './posse.js'

import { showResume, showChinese } from './util.js';

// pixi sprite variables
let world, title, python, posse, ogre, bubble;

// other game variables
let state, currentSpeech, action, firstColor, secondColor;

// init pixi
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

let view = app.view,
    loader = app.loader,
    resources = app.loader.resources,
    stage = app.stage;

document.body.appendChild(view);

// load image assets
loader
  .add("world", "assets/img/world6.png")
  .add("title", "assets/img/title.png")
  .add("python", "assets/img/snake.json")
  .add("knight", "assets/img/knight.json")
  .add("ogre", "assets/img/shrek3.png")
  .add("bubble", "assets/img/speech2.png")
  .add("madOgre", "assets/img/shrek_mad.png")
  .load(setUp);

function setUp() {

  // set up sprite objects
  world = new PIXI.Sprite(resources.world.texture);
  world.width = window.innerHeight * 4;
  world.height = window.innerHeight;
  stage.addChild(world);

  title = new PIXI.Sprite(resources.title.texture);
  title.width = title.height = 0;
  title.position.set(window.innerWidth / 2, window.innerHeight / 2);
  title.anchor.set(0.5);
  stage.addChild(title);

  let ogreAR = .71;
  ogre = new PIXI.Sprite(resources.ogre.texture);
  ogre.width = window.innerHeight * .5 * ogreAR;
  ogre.height = window.innerHeight * .5;
  ogre.position.set(window.innerWidth * 1.38, window.innerHeight * .45);
  stage.addChild(ogre);

  bubble = new PIXI.Sprite(resources.bubble.texture);
  bubble.width = window.innerHeight * .75;
  bubble.height = window.innerHeight * .5;
  bubble.position.set(window.innerWidth * .6, window.innerHeight * .05);
  bubble.visible = false;
  stage.addChild(bubble);

  python = new Python(app, "python");

  posse = new Posse(app, python.sprite, "knight");

  // initial config
  python.faceRight(2);
  nextSpeech();
  state = intro;

  // start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

/** game states **/

let waitTitle = 0;

function intro(delta) {
  const ratio = 16 / 9;

  // expand title
  if (title.height < window.innerHeight) {
    title.width += 6 * ratio;
    title.height += 6;
  } else {
    // wait awhile
    if (waitTitle++ > 200) {
      // fade out
      title.alpha -= .01;
    }
  }

  if (python.sprite.x < (window.innerHeight * .69)) {
    python.move();
    posse.move();
  } else {
    python.stop();
    posse.stop();

    if (title.alpha <= 0) {
      python.startX = python.sprite.x;
      initKeyboard();
      state = play;
    }
  }
}

function play(delta) {
  if (inBounds()) {
    python.move();
    posse.move();
    world.x -= python.sprite.vx * 1.5;
    ogre.x -= python.sprite.vx * 1.5;
  }

  if ((ogre.x - python.sprite.x) < (window.innerWidth * .11)) {
    bubble.visible = true;
    currentSpeech.show();
  } else {
    bubble.visible = false;
    currentSpeech.hide();
  }
}

function proceed(delta) {
  python.move();
  posse.move();
}


function flee(delta) {
  currentSpeech.show();
  python.move();
  posse.move();
  ogre.x += python.sprite.vx;
  bubble.x += python.sprite.vx;
  currentSpeech.move(python.sprite.vx);
}

/** helper methods **/

function inBounds() {
  let newX = python.sprite.x + python.sprite.vx
  return newX >= python.startX && newX < (ogre.x - (window.innerWidth * .11) + 1);
}

function nextSpeech() {
  if (currentSpeech) currentSpeech.remove();
  currentSpeech = speeches.shift();
  currentSpeech.attach(app);
}

function compareColors() {
  firstColor == secondColor ? doAction() : resetGame();
}

function doAction() {
  action(app);
}

function engageWar() {
  speeches.push(new Speech("Of you go, then!", null));
  nextSpeech();
  currentSpeech.show();

  setTimeout(() => {
    currentSpeech.remove();
    bubble.visible = false;
    python.faceRight(3);
    posse.faceRight();
    ogre.vx = 0;
  
    state = proceed;
    setTimeout(() => {
      window.location = 'https://translation-warfare.herokuapp.com';
    }, 2222);
  }, 1234);
}

function seekGrail() {
  speeches.push(new Speech("Of you go, then!", null));
  nextSpeech();
  currentSpeech.show();

  setTimeout(() => {
    currentSpeech.remove();
    bubble.visible = false;
    python.faceRight(3);
    posse.faceRight();
    ogre.vx = 0;
  
    state = proceed;
    setTimeout(() => {
      window.location = 'https://rubyonrails.org';
    }, 2222);
  }, 1234);
}

function resetGame() {
  speeches.push(new Speech("LIAR!", null));
  speeches.push(new Speech("GET OUT OF MY SWAMP!", null));
  nextSpeech();
  currentSpeech.show();

  setTimeout(() => {
    nextSpeech();
    currentSpeech.show();
    ogre.texture = resources.madOgre.texture;
    python.faceLeft(3);
    posse.faceLeft();
    state = flee;
  }, 1234);
}

function initKeyboard(){
    let keyboard = new Keyboard();

    Object.assign(keyboard.right, {
      press:() => {
        python.faceRight(1);
        posse.faceRight();
      },
      release:() => {
        if (!keyboard.left.isDown) {
          python.stop();
          posse.stop();
        }
      }
    });

    Object.assign(keyboard.left, {
      press:() => {
        python.faceLeft(1);
        posse.faceLeft();
      },
      release:() => {
        if (!keyboard.right.isDown) {
          python.stop();
          posse.stop();
        }
      }
    });
}

// data
let names = [
  new Response("Employer", () => console.log("Employer"), nextSpeech, 0x000000, 0),
  new Response("Family", () => console.log("Family"), nextSpeech, 0x000000, 0),
  new Response("Friend", () => console.log("Friend"), nextSpeech, 0x000000, 0),
  new Response("Nemesis", () => console.log("Nemesis"), nextSpeech, 0x000000, 0)
];

let quests = [
  new Response("Explore My Résumé", () => action = showResume, nextSpeech, 0x000000, 0),
  new Response("Venture to the Orient", () => action = showChinese, nextSpeech, 0x000000, 0),
  new Response("Engage in Warfare", () => action = engageWar, nextSpeech, 0x000000, 0),
  new Response("Seek the Holy Grail", () => action = seekGrail, nextSpeech, 0x000000, 0)
];

let colors = [
  new Response("Red", () => firstColor = "Red", nextSpeech, 0xFF0000, 5),
  new Response("Yellow", () => firstColor = "Yellow", nextSpeech, 0xFFFF00, 5),
  new Response("Green", () => firstColor = "Green", nextSpeech, 0x00FF00, 5),
  new Response("Blue", () => firstColor = "Blue", nextSpeech, 0x0000FF, 5),
];

let confirm = [
  new Response("Green", () => secondColor = "Green", compareColors, 0xFF0000, 5),
  new Response("Blue", () => secondColor = "Blue", compareColors, 0xFFFF00, 5),
  new Response("Red", () => secondColor = "Red", compareColors, 0x00FF00, 5),
  new Response("Yellow", () => secondColor = "Yellow", compareColors , 0x0000FF, 5),
];

let speeches = [
  new Speech("What is your name?", names),
  new Speech("What is your quest?", quests),
  new Speech("What is your favorite color?", colors), 
  new Speech("Confirm your favorite color.", confirm)
]