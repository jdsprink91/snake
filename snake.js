(function(gbl, ramda, square) {
  // some constants
  // holds informatino about directions and certain consistant important numbers
  const DIR_STATE_RIGHT = 'right';
  const DIR_STATE_UP = 'up';
  const DIR_STATE_DOWN = 'down';
  const DIR_STATE_LEFT = 'left';
  const SQUARE_HEIGHT_WIDTH = 15;
  const MOVE_DIST = 20;
  const INTERVAL = '70';
  const COLOR = 'black';

  // this is a function that returns a "snake" object
  function Snake(canvas, updateScoreFn) {
    // some initial set up
    var ctx = canvas.getContext('2d');
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;

    // some variables that will be set up in the init function
    var snakeSqrs, dirState, dirQueue, isActive, score, occupiedMap, kibble;

    // sets up everything for the game
    function init() {
      snakeSqrs = [square(0, 0, SQUARE_HEIGHT_WIDTH, SQUARE_HEIGHT_WIDTH, COLOR)];
      dirState = DIR_STATE_RIGHT;
      dirQueue = [dirState];
      isActive = true;
      score = 0;

      // this is a map that will help me keep track of which spaces are occupied
      occupiedMap = ramda.times(() => {
        return ramda.times(() => {
          return 0;
        }, canvasHeight / MOVE_DIST);
      }, canvasWidth / MOVE_DIST);

      // the first space is occupied
      setSquare(snakeSqrs[0], occupiedMap, 1);

      // set up the random "kibble" thing
      kibble = generateNewKibble(occupiedMap, canvasHeight, canvasWidth);
      setSquare(kibble, occupiedMap, 2);

      // draw everything
      snakeSqrs.forEach((x) => {x.draw(ctx);});
    }

    // a function that sets the direction based on certain keys
    // it will just append to the queue whenever you want it to
    function setDirection(key) {
      switch(key) {
        case 37 :
          dirQueue.push(DIR_STATE_LEFT);
          break;
        case 38 :
          dirQueue.push(DIR_STATE_UP);
          break;
        case 39 :
          dirQueue.push(DIR_STATE_RIGHT);
          break;
        case 40 :
          dirQueue.push(DIR_STATE_DOWN);
          break;
        default :
          break;
      }
    }

    // this is how the snake "moves"
    function move(dir) {
      // get the head of the snake and use it to get the latest coordinates
      var head = snakeSqrs[0];
      var firstSnakeSqrs = square(
        head.getX(),
        head.getY(),
        SQUARE_HEIGHT_WIDTH,
        SQUARE_HEIGHT_WIDTH,
        COLOR
      );

      // make sure to move it in the right direction
      // use the window mod because the negative mod doesn't work in javascript
      switch(dir) {
        case DIR_STATE_RIGHT :
          firstSnakeSqrs.setX(mod(firstSnakeSqrs.getX() + MOVE_DIST, canvasWidth));
          break;
        case DIR_STATE_LEFT :
          firstSnakeSqrs.setX(mod(firstSnakeSqrs.getX() - MOVE_DIST, canvasWidth));
          break;
        case DIR_STATE_UP :
          firstSnakeSqrs.setY(mod(firstSnakeSqrs.getY() - MOVE_DIST, canvasHeight));
          break;
        case DIR_STATE_DOWN :
          firstSnakeSqrs.setY(mod(firstSnakeSqrs.getY() + MOVE_DIST, canvasHeight));
          break;
        default :
          break;
      }

      // get the next value of the new first snake square head
      var occupiedVal = occupiedMap[firstSnakeSqrs.getX() / MOVE_DIST][firstSnakeSqrs.getY() / MOVE_DIST];

      // if it's a kibble area, then eat it and add it
      // if it's a snakesquare, then you die
      // otherwise, just erase the tail
      if(occupiedVal === 2) {
        // get the new kibble bit
        eraseSquare(kibble, occupiedMap);
        kibble = generateNewKibble(occupiedMap, canvasHeight, canvasWidth);
        setSquare(kibble, occupiedMap, 2);

        // update the score
        score += 1;
        updateScoreFn(score);
      } else if(occupiedVal === 1) {
        alert("Game Over");
        isActive = false;
      } else {
        var tail = snakeSqrs.pop();
        eraseSquare(tail, occupiedMap);
      }

      // draw the snake square, then set the square on the occupied map
      firstSnakeSqrs.draw(ctx);
      snakeSqrs.unshift(firstSnakeSqrs);
      setSquare(firstSnakeSqrs, occupiedMap, 1);
    }

    // check to see if these two directions conflict
    function isConflict(dirOne, dirTwo) {
      return (dirOne === DIR_STATE_LEFT && dirTwo === DIR_STATE_RIGHT) ||
      (dirOne === DIR_STATE_RIGHT && dirTwo === DIR_STATE_LEFT) ||
      (dirOne === DIR_STATE_UP && dirTwo === DIR_STATE_DOWN) ||
      (dirOne === DIR_STATE_DOWN && dirTwo === DIR_STATE_UP);
    }

    // generate a new kibble
    function generateNewKibble(map, height, width) {
      // generate two numbers between 0 and 20
      var x = generateBetweenZeroAndNum(height / MOVE_DIST);
      var y = generateBetweenZeroAndNum(width / MOVE_DIST);

      // if it's already occupied then try again
      if(map[x][y] > 0) {
        return generateNewKibble(map, height, width);
      } else {
        // else return a new square
        return square(
          x * MOVE_DIST,
          y * MOVE_DIST,
          SQUARE_HEIGHT_WIDTH,
          SQUARE_HEIGHT_WIDTH,
          COLOR
        );
      }
    }

    // sets a square on the map to a given value
    function setSquare(sqr, map, val) {
      sqr.draw(ctx);
      map[sqr.getX() / MOVE_DIST][sqr.getY() / MOVE_DIST] = val;
    }

    // erase one square
    function eraseSquare(sqr, map) {
      sqr.erase(ctx);
      map[sqr.getX() / MOVE_DIST][sqr.getY() / MOVE_DIST] = 0;
    }

    // erases everything on the board
    function eraseEverything() {
      // if there is some kibble, then erase it
      if(kibble) {
        eraseSquare(kibble, occupiedMap);
      }

      // if there is a snake, erase everything in the snake
      if(snakeSqrs) {
        snakeSqrs.forEach((x) => {eraseSquare(x, occupiedMap);});
      }
    }

    // generate a number between zero and a given number
    function generateBetweenZeroAndNum(num) {
      return Math.floor(Math.random() * num);
    }

    // set interval to how often we move the square
    // also holds directional logic
    setInterval(() => {
      // if we are active then move
      // otherwise erase everything and start over
      if(isActive) {
        // if it is an empty queue, then just move in the current direction
        if(ramda.isEmpty(dirQueue)) {
          move(dirState);
        } else {
          // get the first element from the dir queue array
          var newDir = dirQueue.shift();

          // if it conflicts, then stay with the old state
          // otherwise, go ahead and change the direction
          if(isConflict(dirState, newDir)) {
              move(dirState);
            } else {
              move(newDir);
              dirState = newDir;
            }
        }
      } else {
        eraseEverything();
        init();
      }
    }, INTERVAL);

    // what we need to expose to the world
    return {
      init : init,
      setDirection : setDirection
    };
  }

  // append it to the window
  gbl.Snake = Snake;
}(window || {}, window.R, window.Square));
