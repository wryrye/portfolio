import * as PIXI from 'pixi.js';
import Question from './question.js'
import Answer from './answer.js'
import { showResume, showChinese } from './util.js';

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

loader
  .add("title", "assets/img/title.png")
  .add("world", "assets/img/world6.png")
  .add("python", "assets/img/snake.json")
  .add("knight", "assets/img/knight.json")
  .add("ogre", "assets/img/shrek3.png")
  .add("madOgre", "assets/img/shrek_mad.png")
  .add("speech", "assets/img/speech2.png")
  .load(setup);

let python, knights, state, sheet, background, shrek, speech, title, currentQuestion, action;
let firstColor, secondColor;

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

function setup() {

  // load sprites
  background = new PIXI.Sprite(resources.world.texture);
  background.width = window.innerHeight * 4;
  background.height = window.innerHeight;
  app.stage.addChild(background);

  title = new PIXI.Sprite(resources.title.texture);
  title.width = 0;
  title.height = 0;
  title.position.set(window.innerWidth / 2, window.innerHeight / 2);
  title.anchor.x = .5
  title.anchor.y = .5
  app.stage.addChild(title);

  let shrekAR = .71;
  shrek = new PIXI.Sprite(resources.ogre.texture);
  shrek.width = window.innerHeight * .5 * shrekAR;
  shrek.height = window.innerHeight * .5;
  shrek.position.set(window.innerWidth * 1.4, window.innerHeight * .45);
  app.stage.addChild(shrek);

  speech = new PIXI.Sprite(resources.speech.texture);
  speech.width = window.innerHeight * .75;
  speech.height = window.innerHeight * .5;
  speech.position.set(window.innerWidth * .6, window.innerHeight * .05);
  speech.visible = false;
  app.stage.addChild(speech);

  sheet = resources.python.spritesheet;
  python = new PIXI.AnimatedSprite(sheet.animations["snake_idle"]);
  python.position.set(window.innerHeight * .69 - window.innerHeight, window.innerHeight * .8); // almost bottom-left corner of the canvas
  python.animationSpeed = 0.3;
  python.anchor.x = .5
  python.anchor.y = .5
  python.scale.x = 1
  python.vx = 1
  python.vy = 0
  python.play();
  python.width = window.innerHeight*1.3;
  python.height = window.innerHeight*1.3;
  app.stage.addChild(python);

  addKnights();

  python.vx = 2;
  python.scale.x = 1
  python.textures = sheet.animations["snake_run"];
  python.width = window.innerHeight*1.3;
  python.height = window.innerHeight*1.3;
  python.play()
  knightsRight();
  playKnights();


  // load first question
  nextQuestion();


  let left = keyboard("ArrowLeft"),
    right = keyboard("ArrowRight"),
    up = keyboard("ArrowUp"),
    down = keyboard("ArrowDown");

  // Right
  right.press = () => {
    python.vx = 1;
    python.vy = 0;
    python.scale.x = 1
    python.textures = sheet.animations["snake_run"];
    python.width = window.innerHeight*1.3;
    python.height = window.innerHeight*1.3;
    python.play()
    knightsRight();
    playKnights();
  };

  right.release = () => {
    if (!left.isDown && python.vy === 0) {
      python.vx = 0;
      python.textures = sheet.animations["snake_idle"];
      python.width = window.innerHeight*1.3;
      python.height = window.innerHeight*1.3;
      python.play()
      stopKnights();
    }
  };

  // Left
  left.press = () => {
    python.vx = -1;
    python.vy = 0;
    python.scale.x = -1

    python.width = window.innerHeight*1.3;
    python.height = window.innerHeight*1.3;
    python.textures = sheet.animations["snake_run"];
    python.play()
    knightsLeft();
    playKnights();
  };

  left.release = () => {
    if (!right.isDown && python.vy === 0) {
      python.vx = 0;
      python.textures = sheet.animations["snake_idle"];
      python.width = window.innerHeight*1.3;
      python.height = window.innerHeight*1.3;
      python.play()
      stopKnights();
    }
  };



  //Set the game state
  // state = play;
  state = intro;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Update the current game state:
  state(delta);
}

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
    moveKnights();
  } else {
    python.vx = 0;
    python.textures = sheet.animations["snake_idle"];
    python.width = window.innerHeight*1.3;
    python.height = window.innerHeight*1.3;
    python.play()
    stopKnights();

    if (title.alpha <= 0) {
      state = play;
    }
  }



}

function play(delta) {

  //Use the python's velocity to make it move
  python.x += python.vx;
  python.y += python.vy
  moveKnights();
  background.x -= python.vx * 1.5;
  shrek.x -= python.vx * 1.5;

  // if (python.x < window.innerHeight * .66) {
  //   python.x = window.innerHeight * .66;
  // }


  if (shrek.x - python.x < window.innerWidth * .1) {
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
  moveKnights();
  background.x -= python.vx * 1.5;
  // shrek.x -= python.vx * 1.5;

  python.scale.x = -1

  python.width = window.innerHeight*1.3;
  python.height = window.innerHeight*1.3;
  python.textures = sheet.animations["snake_run"];
  python.play()
  knightsLeft();
  playKnights();

}

function resetGame() {
  // nextQuestion();
  shrek.texture = resources.madOgre.texture;
  python.vx = -3
  state = flee;
}

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

function addKnights() {
  let sheet2 = resources.knight.spritesheet;
  knights = []

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
    app.stage.addChild(knight);
    knights.push(knight)
  }
}

function playKnights() {
  knights.forEach((knight, index) => {
    knight.play();
  });
}

function stopKnights() {
  knights.forEach((knight, index) => {
    knight.gotoAndStop(1);
  });
}

function moveKnights() {
  knights.forEach((knight, index) => {
    knight.x += python.vx;
    knight.y += python.vy
  });
}

function knightsLeft() {
  knights.forEach((knight, index) => {
    if (knight.scale.x > 1) knight.scale.x *= -1;
  });
}

function knightsRight() {
  knights.forEach((knight, index) => {
    if (knight.scale.x < 1) knight.scale.x *= -1;
  });
}