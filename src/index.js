import * as PIXI from 'pixi.js';
import Keyboard from './keyboard.js'
import Question from './question.js'
import Answer from './answer.js'
import Python from './python.js'
import Posse from './posse.js'

import { showResume, showChinese } from './util.js';

// pixi sprite variables
let world, title, python, posse, ogre, speech;

// other game variables
let state, currentQuestion, action, firstColor, secondColor;

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
  .add("speech", "assets/img/speech2.png")
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

  python = new Python(app, "python");

  posse = new Posse(app, python.sprite, "knight");

  let ogreAR = .71;
  ogre = new PIXI.Sprite(resources.ogre.texture);
  ogre.width = window.innerHeight * .5 * ogreAR;
  ogre.height = window.innerHeight * .5;
  ogre.position.set(window.innerWidth * 1.38, window.innerHeight * .45);
  stage.addChild(ogre);

  speech = new PIXI.Sprite(resources.speech.texture);
  speech.width = window.innerHeight * .75;
  speech.height = window.innerHeight * .5;
  speech.position.set(window.innerWidth * .6, window.innerHeight * .05);
  speech.visible = false;
  stage.addChild(speech);


  // initial config
  python.faceRight(2);
  nextQuestion();
  state = intro;

  // start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

/** game states **/

let wait = 0;

function intro(delta) {
  const ratio = 16 / 9;

  // expand title
  if (title.height < window.innerHeight) {
    title.width += 6 * ratio;
    title.height += 6;
  } else {
    // wait awhile
    if (wait++ > 200) {
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

  if ((ogre.x - python.sprite.x) < (window.innerWidth * .1)) {
    speech.visible = true;
    currentQuestion.show();
  } else {
    speech.visible = false;
    currentQuestion.hide();
  }
}

function flee(delta) {
  python.move();
  posse.move();
  world.x -= python.sprite.vx * 1.5;
}

/** helper methods **/

function inBounds() {
  let newX = python.sprite.x + python.sprite.vx
  console.log(newX + ", " + (ogre.x - (window.innerWidth * .1)));
  return newX >= python.startX && newX < (ogre.x - (window.innerWidth * .1) + 1);
}

function nextQuestion() {
  if (currentQuestion) currentQuestion.remove();
  currentQuestion = questions.shift();
  currentQuestion.attach(app);
}

function compareColors() {
  console.log(firstColor == secondColor);
  firstColor == secondColor ? doAction() : resetGame();
}

function doAction() {
  action(app);
}

function resetGame() {
  ogre.texture = resources.madOgre.texture;
  python.faceLeft(3);
  posse.faceLeft();
  state = flee;
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