(function(gbl) {
  // because javascript mod is pretty annoying
  function mod(x, y) {
    return ((x % y) + y) % y;
  }

  // set it to the window
  gbl.mod = mod;
}(window || {}));
