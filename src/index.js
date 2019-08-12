import * as PIXI from 'pixi.js';
import Question from './question.js'
import Answer from './answer.js'
import { showResume, showChinese } from './util.js';

let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

//Create a Pixi Application
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1
}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// load sprite sheet image + data file, call setup() if completed
app.loader
  .add("assets/img/title.png")
  .add("assets/img/world4.png")
  .add("assets/img/snake.json")
  .add("assets/img/knight.json")
  .add("assets/img/shrek2.png")
  .add("assets/img/speech2.png")
  .load(setup);

let python, knights, state, sheet, background, shrek, speech, title, currentQuestion, action;

let names = [
  new Answer("Employer", () => console.log("Employer"), nextQuestion),
  new Answer("Family", () => console.log("Family"), nextQuestion),
  new Answer("Friend", () => console.log("Friend"), nextQuestion),
  new Answer("Foe", () => console.log("Foe"), nextQuestion)
];

let quests = [
  new Answer("Explore My Résumé", () => action = showResume, nextQuestion),
  new Answer("Venture to The Orient", () => action = showChinese, nextQuestion),
  new Answer("Seek the Holy Grail", () => console.log("Family"), nextQuestion),
  new Answer("Fight the Ogre", () => console.log("Foe"), nextQuestion)
];

let colors = [
  new Answer("Yellow", () => console.log("Yellow"), doAction),
  new Answer("Green", () => console.log("Green"), doAction),
  new Answer("Blue", () => console.log("Blue"), doAction),
  new Answer("Blue... No, Yellow!", () => console.log("undecided"), () => console.log("TBA"))
];

let questions = [
  new Question("What is your name?", names),
  new Question("What is your quest?", quests),
  new Question("What is your favorite color?", colors)
]

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
  background = new PIXI.Sprite(app.loader.resources["assets/img/world4.png"].texture);
  background.width = window.innerWidth * 2.5;
  background.height = window.innerHeight;
  app.stage.addChild(background);

  title = new PIXI.Sprite(app.loader.resources["assets/img/title.png"].texture);
  title.width = 0;
  title.height = 0;
  title.position.set(window.innerWidth / 2, window.innerHeight / 2);
  title.anchor.x = .5
  title.anchor.y = .5
  app.stage.addChild(title);

  shrek = new PIXI.Sprite(app.loader.resources["assets/img/shrek2.png"].texture);
  shrek.width = shrek.width / 2.5;
  shrek.height = shrek.height / 2.5;
  shrek.position.set(2400, window.innerHeight - 420);
  app.stage.addChild(shrek);

  speech = new PIXI.Sprite(app.loader.resources["assets/img/speech2.png"].texture);
  speech.width = speech.width / 1.5;
  speech.height = speech.height / 2.5;
  speech.position.set(1400, window.innerHeight - 800);
  speech.visible = false;
  app.stage.addChild(speech);

  sheet = app.loader.resources["assets/img/snake.json"].spritesheet;
  python = new PIXI.AnimatedSprite(sheet.animations["snake_idle"]);
  python.position.set(600, window.innerHeight - 190); // almost bottom-left corner of the canvas
  python.animationSpeed = 0.4;
  python.anchor.x = .5
  python.anchor.y = .5
  python.scale.x = 1
  python.vx = 0
  python.vy = 0
  python.play();
  python.width = 1000;
  python.height = 1000;
  app.stage.addChild(python);

  addKnights();


  // load first question
  nextQuestion();


  let left = keyboard("ArrowLeft"),
    right = keyboard("ArrowRight"),
    up = keyboard("ArrowUp"),
    down = keyboard("ArrowDown");

  // Left
  left.press = () => {
    python.vx = -1;
    python.vy = 0;
    python.scale.x = -1

    python.width = 1000;
    python.height = 1000;
    python.textures = sheet.animations["snake_run"];
    python.play()
    playKnights();
  };

  left.release = () => {
    if (!right.isDown && python.vy === 0) {
      python.vx = 0;
      python.textures = sheet.animations["snake_idle"];
      python.width = 1000;
      python.height = 1000;
      python.play()
      stopKnights();
    }
  };

  // Right
  right.press = () => {
    python.vx = 1;
    python.vy = 0;
    python.scale.x = 1
    python.textures = sheet.animations["snake_run"];
    python.width = 1000;
    python.height = 1000;
    python.play()
    playKnights();
  };

  right.release = () => {
    if (!left.isDown && python.vy === 0) {
      python.vx = 0;
      python.textures = sheet.animations["snake_idle"];
      python.width = 1000;
      python.height = 1000;
      python.play()
      stopKnights();
    }
  };

  //Set the game state
  state = play;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Update the current game state:
  state(delta);
}

function play(delta) {
  const ratio = 16 / 9;

  if (title.height < window.innerHeight) {
    title.width += 6 * ratio;
    title.height += 6;
  } else {
    title.alpha -= .01;
  }


  //Use the python's velocity to make it move
  python.x += python.vx;
  python.y += python.vy
  moveKnights();
  background.x -= python.vx * 1.5;
  shrek.x -= python.vx * 1.5;

  if (shrek.x - python.x < 250) {
    speech.visible = true;
    currentQuestion.show();
  } else {
    speech.visible = false;
    currentQuestion.hide();
  }
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
  let sheet2 = app.loader.resources["assets/img/knight.json"].spritesheet;
  knights = []

  for (let i = 0; i < 3; i++) {
    // create an animated sprite
    let knight = new PIXI.AnimatedSprite(sheet2.animations["knight"]);

    // configure + start animation:
    knight.position.set((i + 1) * 100, window.innerHeight - 180); // almost bottom-left corner of the canvas
    knight.animationSpeed = 0.25;
    knight.anchor.x = .5
    knight.anchor.y = .5
    knight.scale.x = 1
    knight.vx = 0
    knight.vy = 0
    knight.gotoAndStop(1);

    knight.width = 300;
    knight.height = 300;

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