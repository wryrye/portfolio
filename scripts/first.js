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
PIXI.loader
    .add("images/title.png")
    .add("images/world4.png")
    .add("images/snake.json")
    .add("images/knight.json")
    .add("images/shrek2.png")
    .add("images/speech.png")
    .load(setup);

let python, knights, state, sheet, background, shrek, speech, richText, title, button;

function setup() {

    background = new PIXI.Sprite(PIXI.loader.resources["images/world4.png"].texture);
    background.width = window.innerWidth*2.5;
    background.height = window.innerHeight;
    app.stage.addChild(background);

    title = new PIXI.Sprite(PIXI.loader.resources["images/title.png"].texture);
    title.width = 0;
    title.height = 0;
    title.position.set(window.innerWidth/2, window.innerHeight/2);
    title.anchor.x=.5
    title.anchor.y=.5
    app.stage.addChild(title);

    shrek = new PIXI.Sprite(PIXI.loader.resources["images/shrek2.png"].texture);
    shrek.width = shrek.width/2.5;
    shrek.height = shrek.height/2.5;
    shrek.position.set(2400, window.innerHeight - 420);
  
    app.stage.addChild(shrek);

    speech = new PIXI.Sprite(PIXI.loader.resources["images/speech.png"].texture);
    speech.width = speech.width/2;
    speech.height = speech.height/2.5;
    speech.position.set(1400, window.innerHeight - 800);
    speech.visible = false;
  
    app.stage.addChild(speech);

    const style = new PIXI.TextStyle({
      fontFamily: '8bitoperator JVE Regular',
      // fontSize: 36,
      // fontStyle: 'italic',
      // fontWeight: 'bold',
      // fill: ['#ffffff', '#00ff99'], // gradient
      // stroke: '#4a1850',
      // strokeThickness: 5,
      // dropShadow: true,
      // dropShadowColor: '#000000',
      // dropShadowBlur: 4,
      // dropShadowAngle: Math.PI / 6,
      // dropShadowDistance: 6,
      // wordWrap: true,
      // wordWrapWidth: 440,
  });
  
  richText = new PIXI.Text('What is your quest?', style);
  richText.position.set(1500, window.innerHeight - 750);
  richText.visible = false;

  button = new PIXI.Text('View Resume', style);
  button.position.set(1500, window.innerHeight - 650);
  button.visible = false;

  button.interactive = true;
  button.on('click', () => {
    window.location = "https://github.com/wryrye/portfolio/blob/master/src/assets/docs/ryan_coughlin_resume.pdf";

  });


  
  app.stage.addChild(richText);
  app.stage.addChild(button);




    // the sprite sheet we've just loaded:
    sheet = PIXI.loader.resources["images/snake.json"].spritesheet;

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
  ratio = 16/9;

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
    button.visible = true;
  } else {
    speech.visible = false;
    richText.visible = false;
    button.visible = false;
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
    sheet2 = PIXI.loader.resources["images/knight.json"].spritesheet;
    knights = []

    for (let i = 0; i < 3; i++) {
        // create an animated sprite
        knight = new PIXI.AnimatedSprite(sheet2.animations["knight"]);

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