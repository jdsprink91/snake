// function that deals with building squares and such
(function(gbl) {
  function Square(xCord, yCord, h, w, c) {
    var x = xCord;
    var y = yCord;
    var height = h;
    var width = w;
    var color = c;

    // getters and setters
    function getX() {
      return x;
    }

    function setX(moveX) {
      x = moveX;
    }

    function getY() {
      return y;
    }

    function setY(moveY) {
      y = moveY;
    }

    function getHeight() {
      return height;
    }

    function setHeight(height) {
      height = height;
    }

    function getWidth() {
      return width;
    }

    function setWidth(width) {
      width = width;
    }

    // this draws the square on the canvas
    function draw(ctx) {
      ctx.fillRect(x, y, height, width);
    }

    function erase(ctx) {
      ctx.clearRect(x, y, width, height);
    }

    // return the square objects
    return {
      getX : getX,
      setX : setX,
      getY : getY,
      setY : setY,
      getHeight : getHeight,
      setHeight : setHeight,
      getWidth : getWidth,
      setWidth : setWidth,
      color : color,
      draw : draw,
      erase : erase
    };
  }

  // append the square to the global space
  gbl.Square = Square;
}(window || {}));
