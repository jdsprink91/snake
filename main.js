(function(canvas, score, snake, gbl) {
  var lastDownTarget = null;

  // start snake
  var game = snake(canvas, (x) => {
    score.textContent = x;
  });

  // initialize the game
  game.init();

  // focus on the canvas when you've clicked on it
  gbl.addEventListener('mousedown', function(event) {
        lastDownTarget = event.target;
    }, false);

  gbl.addEventListener('keydown', keydownHandler, false);
  function keydownHandler(event) {
    if(lastDownTarget === canvas) {
      game.setDirection(event.keyCode);
    }
  }

}(document.getElementById('snakePit'), document.getElementById('score'), window.Snake, window));
