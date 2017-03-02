var fps = 10, alive = [], candidates = {}, newAlive = [], living, timeouts = [];


// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to do one iteration of the game of life
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function updateBoard() {

  // check if game has been turned off
  if (living)
    // if not, do the next iteration after timeout according to fps
    timeouts.push(setTimeout(function(){
      requestAnimationFrame(updateBoard());
    },1000/fps));


  // initialise object to hold possible state-change cells
  candidates = {};

  // iterate through living cells, incrementing the neighbour count of all adjacent cells
  for (var i in alive) {
    i = Number(alive[i]);

    // increment neighbour count for cells above & below the current living cell
    candidates[i-gridSize] = ++candidates[i-gridSize]||1;
    candidates[i+gridSize] = ++candidates[i+gridSize]||1;

    // increment neighbour count for cells left, above-left & below-left of the current living cell, unless the current cell is on the left-hand boundary
    // overflowing the top or bottom boudaries is ok at this stage, but left- and right-hand boundaries wrap around
    if (i%gridSize > 0) {
      candidates[i-gridSize-1] = ++candidates[i-gridSize-1]||1;
      candidates[i-1]   = ++candidates[i-1]||1;
      candidates[i+gridSize-1]  = ++candidates[i+gridSize-1]||1;
    }

    // increment neighbour count for cells right, above-right & below-right of the current living cell, unless the current cell is on the right-hand boundary
    if (i%gridSize < gridSize-1) {
      candidates[i-gridSize+1]  = ++candidates[i-gridSize+1]||1;
      candidates[i+1]   = ++candidates[i+1]||1;
      candidates[i+gridSize+1] = ++candidates[i+gridSize+1]||1;
    }
  }

  // initialise array to hold the confirmed state-change cells
  newAlive = [];

  for (var j in candidates) {
    j = Number(j);
    // check that the cell index is in range (deals with top/bottom grid overflow)
    if (0 <= j && j < gridSize*gridSize)
      // enforces the rules of the game of life:
      switch (candidates[j]) {
        case 2: if (alive.includes(j)) newAlive.push(j); break;
        case 3: newAlive.push(j); break;
      }
  }

  // update record of living cells
  alive = newAlive;
  // then draw them on the webpage
  updateShapes();
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to start continuous play
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function go() {
  // (do nothing if already running)
  if (living) return

  living = true;
  updateBoard();
}



// ––––––––––––––––––––––––––––––––––––––––––––––––––
// function to stop continuous play
// ––––––––––––––––––––––––––––––––––––––––––––––––––
function stop() {
  living = false;
  for (var i in timeouts) clearTimeout(timeouts[i]);
  timeouts = [];
}