import * as PIXI from 'pixi.js';

function showResume() {
    var pdfjsLib = require('pdfjs-dist');
    var pdfPath = 'assets/docs/ryan_coughlin_resume.pdf';
    // $("a").attr("href", pdfPath); //set download path
    
    var loadingTask = pdfjsLib.getDocument(pdfPath);

    var loadingTask = pdfjsLib.getDocument(pdfPath);
    loadingTask.promise.then(function (pdfDocument) {
        // Request a first page
        return pdfDocument.getPage(1).then(function (pdfPage) {
            // Display page on the existing canvas with 100% scale.

            var canvas = document.getElementById('pdfjs');
            canvas.style.display = "inherit"

            app.view.style.display = "none";

            var viewport = pdfPage.getViewport(3.0);

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            var ctx = canvas.getContext('2d');
            var renderTask = pdfPage.render({
                canvasContext: ctx,
                viewport: viewport
            });
            return renderTask.promise;
        });
    }).catch(function (reason) {
        console.error('Error: ' + reason);
    });
}



let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
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

let python, knights, state, sheet, background, shrek, speech, richText, title, triangle;

let quests = {
  resume: {
    display:"Explore My Résumé",
    action: showResume,
    textObj: null
  }, 
  orient: {
    display:"Venture to The Orient",
    action: () => console.log("orient"),
    textObj: null
  },
  grail: {
    display:"Seek the Holy Grail",
    action: () => console.log("grail"),
    textObj: null
  },
  ogre: {
    display:"Fight the Ogre",
    action: () => console.log("Ogre"),
    textObj: null
  }
};

function hideQuests() {
  Object.keys(quests).forEach((quest, index) => {
    quests[quest].textObj.visible = false;
  });
}

function showQuests() {
  Object.keys(quests).forEach((quest, index) => {
    quests[quest].textObj.visible = true;
  });
}

function setup() {

    background = new PIXI.Sprite(app.loader.resources["assets/img/world4.png"].texture);
    background.width = window.innerWidth*2.5;
    background.height = window.innerHeight;
    app.stage.addChild(background);

    title = new PIXI.Sprite(app.loader.resources["assets/img/title.png"].texture);
    title.width = 0;
    title.height = 0;
    title.position.set(window.innerWidth/2, window.innerHeight/2);
    title.anchor.x=.5
    title.anchor.y=.5
    app.stage.addChild(title);

    shrek = new PIXI.Sprite(app.loader.resources["assets/img/shrek2.png"].texture);
    shrek.width = shrek.width/2.5;
    shrek.height = shrek.height/2.5;
    shrek.position.set(2400, window.innerHeight - 420);
  
    app.stage.addChild(shrek);

    speech = new PIXI.Sprite(app.loader.resources["assets/img/speech2.png"].texture);
    speech.width = speech.width/1.5;
    speech.height = speech.height/2.5;
    speech.position.set(1400, window.innerHeight - 800);
    speech.visible = false;
    // speech.scale.x=-1;
  
    app.stage.addChild(speech);

    const boldP2 = new PIXI.TextStyle({
      fontFamily: 'Press Start 2P',
      fontSize: 25,
      fontWeight: 'bold',
  });

  const regP2 = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P',
    fontSize: 20,
  });
  
  richText = new PIXI.Text('What is your quest?', boldP2);
  richText.position.set(1500, window.innerHeight - 750);
  richText.visible = false;

  Object.keys(quests).forEach((quest, index) => {
    let textObj = new PIXI.Text(quests[quest].display, regP2);
    textObj.visible = false;
    textObj.interactive = true;

    textObj.on('click', () => {
      quests[quest].action();
    });

    textObj.on('mouseover', () => {
      triangle.x = textObj.x -25;
      triangle.y = textObj.y;
    });

    // console.log(index);
    switch(index){
      case 0:
        textObj.position.set(1500, window.innerHeight - 680);
        break;
      case 1:
        textObj.position.set(1500, window.innerHeight - 645);
        break;
      case 2:
        textObj.position.set(1500, window.innerHeight - 610);
        break;
      case 3:
        textObj.position.set(1500, window.innerHeight - 575);
        break;
    }

    console.log(textObj.y);


    quests[quest].textObj = textObj;
    app.stage.addChild(textObj);
  });

  app.stage.addChild(richText);

  triangle = new PIXI.Graphics();

  triangle.x = quests.resume.textObj.x -25;
  triangle.y = quests.resume.textObj.y;

  var triangleWidth = 15,
      triangleHeight = triangleWidth,
      triangleHalfway = triangleWidth/2;

  // draw triangle 
  triangle.beginFill(0x000000, 1);
  triangle.lineStyle(0, 0xFF0000, 1);
  triangle.moveTo(0, triangleHeight);
  triangle.lineTo(triangleWidth, triangleHalfway); 
  triangle.lineTo(0, 0);
  triangle.lineTo(0, triangleWidth);
  triangle.endFill();

  triangle.interactive = true;
  triangle.buttonMode = true;
  triangle.on("pointertap", function(e) {
    console.log(i);
  });

triangle.visible = false;

  app.stage.addChild(triangle);



    // the sprite sheet we've just loaded:
    sheet = app.loader.resources["assets/img/snake.json"].spritesheet;

    // create an animated sprite
    python = new PIXI.AnimatedSprite(sheet.animations["snake_idle"]);

    // configure + start animation:
    python.position.set(600, window.innerHeight - 190); // almost bottom-left corner of the canvas
    python.animationSpeed = 0.4;
    python.anchor.x=.5
    python.anchor.y=.5
    python.scale.x=1
    python.vx=0
    python.vy=0
    python.play();

    python.width=1000;
    python.height=1000;

    // add it to the stage and render!
    app.stage.addChild(python);

    addKnights();

    let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

    // up.press = () => {
      
    // }

    //Left arrow key `press` method
    left.press = () => {
    //Change the python's velocity when the key is pressed
    python.vx = -1;
    python.vy = 0;
    python.scale.x=-1

    python.width=1000;
    python.height=1000;
    python.textures = sheet.animations["snake_run"];
    python.play()
    playKnights();
    };

    //Left arrow key `release` method
    left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the python isn't moving vertically:
    //Stop the python
    if (!right.isDown && python.vy === 0) {
        python.vx = 0;
        python.textures = sheet.animations["snake_idle"];
        python.width=1000;
        python.height=1000;
        python.play()
        stopKnights();
    }
    };

    //Up
    // up.press = () => {
    // python.vy = -3;
    // python.vx = 0;
    // };
    // up.release = () => {
    // if (!down.isDown && python.vx === 0) {
    //     python.vy = 0;
    // }
    // };

    //Right
    right.press = () => {
    python.vx = 1;
    python.vy = 0;
    python.scale.x=1
    python.textures = sheet.animations["snake_run"];
    python.width=1000;
    python.height=1000;
    python.play()
    playKnights();
    };
    right.release = () => {
    if (!left.isDown && python.vy === 0) {
        python.vx = 0;
        python.textures = sheet.animations["snake_idle"];
        python.width=1000;
        python.height=1000;
        python.play()
        stopKnights();
    }
    };

    //Down
    // down.press = () => {
    // python.vy = 5;
    // python.vx = 0;
    // };
    // down.release = () => {
    // if (!up.isDown && python.vx === 0) {
    //     python.vy = 0;
    // }
    // };





    //Set the game state
    state = play;
    
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
    //Update the current game state:

    state(delta);
}

function play(delta) {
  const ratio = 16/9;

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
    richText.visible = true;
    triangle.visible = true;
    showQuests();
  } else {
    speech.visible = false;
    richText.visible = false;
    triangle.visible = false;
    hideQuests();
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
        knight.position.set((i+1) * 100, window.innerHeight - 180); // almost bottom-left corner of the canvas
        knight.animationSpeed = 0.25;
        knight.anchor.x=.5
        knight.anchor.y=.5
        knight.scale.x=1
        knight.vx=0
        knight.vy=0
        knight.gotoAndStop(1);

        knight.width=300;
        knight.height=300;

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