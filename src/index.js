import * as PIXI from 'pixi.js';
import Keyboard from './keyboard.js'
import Question from './question.js'
import Answer from './answer.js'
import Posse from './posse.js'

import { showResume, showChinese } from './util.js';

// pixi sprite variables
let world, title, python, posse, ogre, speech;

// other game variables
let state, currentQuestion, action, firstColor, secondColor;

// initialize pixi
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

let view = app.view,
    loader = app.loader,
    resources = app.loader.resources;

document.body.appendChild(view);

// load image assets
loader
  .add("world", "assets/img/world6.png")
  .add("title", "assets/img/title.png")
  .add("python", "assets/img/snake.json")
  .add("knight", "assets/img/knight.json")
  .add("ogre", "assets/img/shrek3.png")
  .add("speech", "assets/img/speech2.png")
  .add("madOgre", "assets/img/shrek_mad.png")
  .load(setUp);

function setUp() {

  // set up sprite objects
  world = new PIXI.Sprite(resources.world.texture);
  world.width = window.innerHeight * 4;
  world.height = window.innerHeight;
  app.stage.addChild(world);

  title = new PIXI.Sprite(resources.title.texture);
  title.width = title.height = 0;
  title.position.set(window.innerWidth / 2, window.innerHeight / 2);
  title.anchor.set(0.5);
  app.stage.addChild(title);

  let pythonSheet = resources.python.spritesheet;
  python = new PIXI.AnimatedSprite(pythonSheet.animations["snake_idle"]);
  python.sheet = pythonSheet;
  python.width = python.height = window.innerHeight*1.3;
  python.position.set(window.innerHeight * .69 - window.innerHeight, window.innerHeight * .8);
  python.anchor.set(0.5);
  python.animationSpeed = 0.3;
  python.scale.x = 1
  python.vx = 1
  python.vy = 0
  python.play();
  app.stage.addChild(python);

  posse = new Posse(app, python, "knight");

  let ogreAR = .71;
  ogre = new PIXI.Sprite(resources.ogre.texture);
  ogre.width = window.innerHeight * .5 * ogreAR;
  ogre.height = window.innerHeight * .5;
  ogre.position.set(window.innerWidth * 1.4, window.innerHeight * .45);
  app.stage.addChild(ogre);

  speech = new PIXI.Sprite(resources.speech.texture);
  speech.width = window.innerHeight * .75;
  speech.height = window.innerHeight * .5;
  speech.position.set(window.innerWidth * .6, window.innerHeight * .05);
  speech.visible = false;
  app.stage.addChild(speech);

  // python intro state
  python.vx = 2;
  python.scale.x = 1
  python.textures = python.sheet.animations["snake_run"];
  python.width = window.innerHeight*1.3;
  python.height = window.innerHeight*1.3;
  python.play()

  // configure keyboard
  let keyboard = new Keyboard();

  keyboard.right.press = () => {
    python.vx = 1;
    python.vy = 0;
    python.scale.x = 1
    python.textures = python.sheet.animations["snake_run"];
    python.width = window.innerHeight*1.3;
    python.height = window.innerHeight*1.3;
    python.play()
    posse.faceRight();
  };

  keyboard.right.release = () => {
    if (!keyboard.left.isDown && python.vy === 0) {
      python.vx = 0;
      python.textures = python.sheet.animations["snake_idle"];
      python.width = window.innerHeight*1.3;
      python.height = window.innerHeight*1.3;
      python.play()
      posse.stop();
    }
  };

  keyboard.left.press = () => {
    python.vx = -1;
    python.vy = 0;
    python.scale.x = -1

    python.width = window.innerHeight*1.3;
    python.height = window.innerHeight*1.3;
    python.textures = python.sheet.animations["snake_run"];
    python.play()
    posse.faceLeft();
  };

  keyboard.left.release = () => {
    if (!keyboard.right.isDown && python.vy === 0) {
      python.vx = 0;
      python.textures = python.sheet.animations["snake_idle"];
      python.width = window.innerHeight*1.3;
      python.height = window.innerHeight*1.3;
      python.play()
      posse.stop();
    }
  };


  // load first question
  nextQuestion();

  // set the game state
  state = intro;

  // start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  // update the current game state:
  state(delta);
}

//game states

let wait = 0;

function intro(delta) {
  const ratio = 16 / 9;

  if (title.height < window.innerHeight) {
    title.width += 6 * ratio;
    title.height += 6;
  } else {
    wait++;
    if (wait > 200) {
      title.alpha -= .01;
    }
  }

  if (python.x < window.innerHeight * .69) {
    python.x += python.vx;
    posse.move();
  } else {
    python.vx = 0;
    python.textures = python.sheet.animations["snake_idle"];
    python.width = window.innerHeight*1.3;
    python.height = window.innerHeight*1.3;
    python.play()
    posse.stop();

    if (title.alpha <= 0) {
      state = play;
    }
  }
}

function play(delta) {

  //Use the python's velocity to make it move
  python.x += python.vx;
  python.y += python.vy
  posse.move();
  world.x -= python.vx * 1.5;
  ogre.x -= python.vx * 1.5;

  // if (python.x < window.innerHeight * .66) {
  //   python.x = window.innerHeight * .66;
  // }


  if (ogre.x - python.x < window.innerWidth * .1) {
    speech.visible = true;
    currentQuestion.show();
  } else {
    speech.visible = false;
    currentQuestion.hide();
  }
}

function flee(delta) {
  python.x += python.vx;
  python.y += python.vy
  posse.move();
  world.x -= python.vx * 1.5;
  // shrek.x -= python.vx * 1.5;

  python.scale.x = -1

  python.width = window.innerHeight*1.3;
  python.height = window.innerHeight*1.3;
  python.textures = python.sheet.animations["snake_run"];
  python.play()
  posse.faceLeft();
}

// helper methods

function compareColors() {
  console.log(firstColor == secondColor);
  firstColor == secondColor ? doAction() : resetGame();
}

function nextQuestion() {
  if (currentQuestion) currentQuestion.remove();
  currentQuestion = questions.shift();
  currentQuestion.attach(app);
}

function doAction() {
  action(app);
}

function resetGame() {
  // nextQuestion();
  ogre.texture = resources.madOgre.texture;
  python.vx = -3
  state = flee;
}



// data
let names = [
  new Answer("Employer", () => console.log("Employer"), nextQuestion, 0x000000, 0),
  new Answer("Family", () => console.log("Family"), nextQuestion, 0x000000, 0),
  new Answer("Friend", () => console.log("Friend"), nextQuestion, 0x000000, 0),
  new Answer("Nemesis", () => console.log("Nemesis"), nextQuestion, 0x000000, 0)
];

let quests = [
  new Answer("Explore My Résumé", () => action = showResume, nextQuestion, 0x000000, 0),
  new Answer("Venture to The Orient", () => action = showChinese, nextQuestion, 0x000000, 0),
  new Answer("Seek the Holy Grail", () => console.log("Family"), nextQuestion, 0x000000, 0),
  new Answer("Fight the Ogre", () => console.log("Foe"), nextQuestion, 0x000000, 0)
];

let colors = [
  new Answer("Red", () => firstColor = "Red", nextQuestion, 0xFF0000, 5),
  new Answer("Yellow", () => firstColor = "Yellow", nextQuestion, 0xFFFF00, 5),
  new Answer("Green", () => firstColor = "Green", nextQuestion, 0x00FF00, 5),
  new Answer("Blue", () => firstColor = "Blue", nextQuestion, 0x0000FF, 5),
];

let confirm = [
  new Answer("Green", () => secondColor = "Green", compareColors, 0xFF0000, 5),
  new Answer("Blue", () => secondColor = "Blue", compareColors, 0xFFFF00, 5),
  new Answer("Red", () => secondColor = "Red", compareColors, 0x00FF00, 5),
  new Answer("Yellow", () => secondColor = "Yellow", compareColors , 0x0000FF, 5),
];

let questions = [
  new Question("What is your NAME?", names),
  new Question("What is your QUEST?", quests),
  new Question("What is your favorite COLOR?", colors), 
  new Question("CONFIRM your favorite COLOR.", confirm),
  new Question("GET OUT OF MY SWAMP!!!", confirm)
]