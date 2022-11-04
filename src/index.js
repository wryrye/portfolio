import * as PIXI from "pixi.js";
import Keyboard from "./keyboard.js";
import Speech from "./speech.js";
import Response from "./response.js";
import Python from "./python.js";
import Posse from "./posse.js";

import { distance, showResume, showChinese } from "./util.js";
import "./styles/stylesheet.css";

// pixi sprite variables
let world, sky, title, python, posse, keys, ogre, bubble, madOgre;

// other game variables
let aspectRatio, state, currentSpeech, action, firstColor, secondColor;

// init pixi
let app = new PIXI.Application({
  width: innerWidth,
  height: innerHeight,
  antialias: true,
  transparent: false,
  resolution: 1,
});

// aliases
let view = app.view,
  loader = app.loader,
  resources = app.loader.resources,
  stage = app.stage;

document.body.appendChild(view);

const arrowKeyFrames = [
  "assets/img/arrow-keys.png",
  "assets/img/arrow-keys-active.png",
];

const madOgreFrames = [
  "assets/img/shrek_mad2.png",
  "assets/img/shrek_mad3.png",
];

// load assets
loader
  .add("world", "assets/img/world6.png")
  .add("sky", "assets/img/world7.png")
  .add("title", "assets/img/title.png")
  .add("python", "assets/img/snake.json")
  .add("knight", "assets/img/knight.json")
  .add("ogre", "assets/img/shrek3.png")
  .add("bubble", "assets/img/speech2.png")
  .load(setUp);

function setUp() {
  // unsupported ratios
  aspectRatio = innerWidth / innerHeight;
  if (aspectRatio < 1.5 || aspectRatio > 2.15) return;

  // set up sprites
  sky = new PIXI.Sprite(resources.sky.texture);
  sky.width = innerHeight * 4;
  sky.height = innerHeight;
  stage.addChild(sky);

  world = new PIXI.Sprite(resources.world.texture);
  world.width = innerHeight * 4;
  world.height = innerHeight;
  stage.addChild(world);

  title = new PIXI.Sprite(resources.title.texture);
  title.width = title.height = 0;
  title.position.set(innerWidth * 0.5, distance(50));
  title.anchor.set(0.5);
  stage.addChild(title);

  keys = new PIXI.AnimatedSprite.fromFrames(arrowKeyFrames);
  let keysAR = 1.5;
  keys.width = distance(25) * keysAR;
  keys.height = distance(25);
  keys.position.set(distance(5), distance(5));
  keys.visible = false;
  keys.animationSpeed = 0.017;
  stage.addChild(keys);

  python = new Python(app, "python");

  posse = new Posse(app, python.sprite, "knight");

  let ogreAR = 0.71;
  ogre = new PIXI.Sprite(resources.ogre.texture);
  ogre.width = distance(50) * ogreAR;
  ogre.height = distance(50);
  ogre.position.set(innerHeight * 3, distance(45));
  stage.addChild(ogre);

  madOgre = new PIXI.AnimatedSprite.fromFrames(madOgreFrames);
  madOgre.width = distance(50) * ogreAR;
  madOgre.height = distance(50);
  madOgre.position.set(innerHeight * 3, distance(45));
  madOgre.visible = false;
  stage.addChild(madOgre);

  bubble = new PIXI.Sprite(resources.bubble.texture);
  bubble.width = distance(105);
  bubble.height = distance(50);
  bubble.position.set(innerWidth * 0.97 - bubble.width, distance(5));
  bubble.visible = false;
  stage.addChild(bubble);

  loadData();

  // initial config
  python.faceRight(2);
  nextSpeech();
  state = intro;

  // start the game loop
  app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
  state(delta);
}

/** game states **/

let waitTitle = 0;

function intro(delta) {
  const ratio = 16 / 9;

  // expand title
  if (title.height < innerHeight) {
    title.width += delta * 10 * ratio;
    title.height += delta * 10;
  } else {
    // wait awhile
    if ((waitTitle += delta) > 80) {
      // fade out
      title.alpha -= 0.01;
    }
  }

  if (python.sprite.x < distance(69)) {
    python.move(delta);
    posse.move(delta);
  } else {
    python.stop();
    posse.stop();

    if (title.alpha <= 0) {
      python.startX = python.sprite.x;
      initKeyboard();
      keys.visible = true;
      keys.play();
      state = play;
    }
  }
}

let dayLength = 500;
let dayTimer = 0;
let isDay = true;

function play(delta) {
  // time between starting transitions
  if ((dayTimer += delta) > dayLength) {
    if (isDay) {
      world.alpha -= 0.002;
    } else {
      world.alpha += 0.002;
    }

    if (world.alpha <= 0.1 || 1 <= world.alpha) {
      isDay = !isDay;
      dayTimer = 0;
    }
  }

  if (inBounds()) {
    python.move(delta);
    posse.move(delta);

    let speed =
      python.sprite.vx === 0
        ? 0
        : python.sprite.vx > 0
        ? delta * 3
        : -delta * 3;
    sky.x -= speed;
    world.x -= speed;
    ogre.x -= speed;
    madOgre.x -= speed;
  }

  if (ogre.x - python.sprite.x < distance(30)) {
    keys.visible = false;
    keys.stop();
    bubble.visible = true;
    currentSpeech.show();
  } else {
    bubble.visible = false;
    currentSpeech.hide();
  }
}

function proceed(delta) {
  python.move(delta);
  posse.move(delta);
}

function flee(delta) {
  currentSpeech.show();
  python.move(delta);
  posse.move(delta);
  madOgre.x += delta * python.sprite.vx * 2;
  bubble.x += delta * python.sprite.vx * 2;
  currentSpeech.move(delta * python.sprite.vx * 2);
}

/** helper methods **/

function inBounds() {
  let newX = python.sprite.x + python.sprite.vx;
  return newX >= python.startX && newX < ogre.x - distance(30) + 1;
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
  speeches.push(new Speech("Off you go, then!", null, bubble));
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
      window.location = "https://tatoebattle.herokuapp.com/";
    }, 2222);
  }, 1234);
}

function seekGrail() {
  speeches.push(new Speech("Off you go, then!", null, bubble));
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
      window.location = "https://rubyonrails.org";
    }, 2222);
  }, 1234);
}

function resetGame() {
  speeches.push(new Speech("LIES!", null, bubble));
  speeches.push(new Speech("GET OUT OF MY SWAMP!", null, bubble));
  nextSpeech();
  currentSpeech.show();

  setTimeout(() => {
    nextSpeech();
    currentSpeech.show();
    ogre.visible = false;
    madOgre.visible = true;
    madOgre.play();
    python.faceLeft(3);
    posse.faceLeft();
    state = flee;

    setTimeout(() => {
      location.reload();
    }, 5000);
  }, 1234);
}

function initKeyboard() {
  let keyboard = new Keyboard();

  Object.assign(keyboard.right, {
    press: () => {
      python.faceRight(aspectRatio * 0.821341 - 1.183005);
      posse.faceRight();
    },
    release: () => {
      if (!keyboard.left.isDown) {
        python.stop();
        posse.stop();
      }
    },
  });

  Object.assign(keyboard.left, {
    press: () => {
      python.faceLeft(aspectRatio * 0.821341 - 1.183005);
      posse.faceLeft();
    },
    release: () => {
      if (!keyboard.right.isDown) {
        python.stop();
        posse.stop();
      }
    },
  });
}
let names, quests, colors, confirm, speeches;

function loadData() {
  names = [
    new Response(
      "Employer",
      () => console.log("Employer"),
      nextSpeech,
      0x000000,
      0
    ),
    new Response(
      "Family",
      () => console.log("Family"),
      nextSpeech,
      0x000000,
      0
    ),
    new Response(
      "Friend",
      () => console.log("Friend"),
      nextSpeech,
      0x000000,
      0
    ),
    new Response(
      "Nemesis",
      () => console.log("Nemesis"),
      nextSpeech,
      0x000000,
      0
    ),
  ];

  quests = [
    new Response(
      "Explore My Résumé",
      () => (action = showResume),
      nextSpeech,
      0x000000,
      0
    ),
    new Response(
      "Venture to the Orient",
      () => (action = showChinese),
      nextSpeech,
      0x000000,
      0
    ),
    new Response(
      "Engage in Warfare",
      () => (action = engageWar),
      nextSpeech,
      0x000000,
      0
    ),
    new Response(
      "Seek the Holy Grail",
      () => (action = seekGrail),
      nextSpeech,
      0x000000,
      0
    ),
  ];

  colors = [
    new Response("Red", () => (firstColor = "Red"), nextSpeech, 0xff0000, 5),
    new Response(
      "Yellow",
      () => (firstColor = "Yellow"),
      nextSpeech,
      0xffff00,
      5
    ),
    new Response(
      "Green",
      () => (firstColor = "Green"),
      nextSpeech,
      0x00ff00,
      5
    ),
    new Response("Blue", () => (firstColor = "Blue"), nextSpeech, 0x0000ff, 5),
  ];

  confirm = [
    new Response(
      "Green",
      () => (secondColor = "Green"),
      compareColors,
      0xff0000,
      5
    ),
    new Response(
      "Blue",
      () => (secondColor = "Blue"),
      compareColors,
      0xffff00,
      5
    ),
    new Response(
      "Red",
      () => (secondColor = "Red"),
      compareColors,
      0x00ff00,
      5
    ),
    new Response(
      "Yellow",
      () => (secondColor = "Yellow"),
      compareColors,
      0x0000ff,
      5
    ),
  ];

  speeches = [
    new Speech("What is your name?", names, bubble),
    new Speech("What is your quest?", quests, bubble),
    new Speech("What is your favorite color?", colors, bubble),
    new Speech("Confirm your favorite color.", confirm, bubble),
  ];
}
