var fps = 10, alive = [], candidates = {}, newAlive = [], living, timeouts = [];

function updateBoard() {
  if (living)
    timeouts.push(setTimeout(function(){
      requestAnimationFrame(updateBoard());
    },1000/fps));

  candidates = {};
  for (var i in alive) {
    i = Number(alive[i]);
    candidates[i-gridSize] = ++candidates[i-gridSize]||1;
    candidates[i+gridSize] = ++candidates[i+gridSize]||1;
    if (i%gridSize > 0) {
      candidates[i-gridSize-1] = ++candidates[i-gridSize-1]||1;
      candidates[i-1]   = ++candidates[i-1]||1;
      candidates[i+gridSize-1]  = ++candidates[i+gridSize-1]||1;
    }
    if (i%gridSize < gridSize-1) {
      candidates[i-gridSize+1]  = ++candidates[i-gridSize+1]||1;
      candidates[i+1]   = ++candidates[i+1]||1;
      candidates[i+gridSize+1] = ++candidates[i+gridSize+1]||1;
    }
  }
  newAlive = [];
  for (var j in candidates) {
    j = Number(j);
    if (0 <= j && j < gridSize*gridSize)
      switch (candidates[j]) {
        case 2: if (alive.includes(j)) newAlive.push(j); break;
        case 3: newAlive.push(j); break;
      }
  } alive = newAlive;
  updateShapes();
}

function go() {
  if (living) return
  living = true;
  updateBoard();
}

function stop() {
  living = false;
  for (var i in timeouts) clearTimeout(timeouts[i]);
  timeouts = [];
}