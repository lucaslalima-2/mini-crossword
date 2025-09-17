const container = document.getElementById("crossword-container");
const grid_length = crossword_json.grid_length;
const entries = crossword_json.entries;

// Creates empty grid
function crossword_create_grid() {
  // Apply css grid styles dynamically
  container.style.gridTemplateColumns = `repeat(${grid_length}, 30px)`;
  container.style.gridTemplateRows = `repeat(${grid_length}, 30px)`;

  // Create grid cells
  for (let row=0; row<grid_length; row++){
    for (let col=0; col<grid_length; col++) {
      // Creates new cell
      const cell = document.createElement("div");
      cell.className="cell";
      cell.id = `cell-${row}-${col}`;

      // Adds top-left number space
      const cellnum = document.createElement("span");
      cellnum.className = "cell-number";
      cellnum.textContent = ""; // is set later
      cell.appendChild(cellnum);

      // Appends
      container.appendChild(cell)
    }; // for col
  }; //for row
}; //function

// Adds numbers to upper-left corner of cells
function crossword_add_numbers() {
  let index = 1;

  // Create a lookup map for fast acess
  const cluemap = new Map();
  entries.forEach(entry => {
    const key = `${entry.origin.row}-${entry.origin.col}-${entry.orientation}`;
    cluemap.set(key, true);  
  });

  // Iterates over all cells & stamps number if clue exists
  for (let row=0; row<grid_length; row++) {
    for(let col=0; col<grid_length; col++){
      const has_across = cluemap.has(`${row}-${col}-across`);
      const has_down = cluemap.has(`${row}-${col}-down`);

      if (has_across || has_down) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        const numspan = cell.querySelector(".cell-number");
        numspan.textContent = index;
        index+=1;
      } // if
    } // for
  } //for 
} // function

// Disables unused cells
function crossword_initialize_cells () {
  // Make a list of all_cells
  const all_cells = new Set();  
  for (let row=0; row<grid_length; row++) {
    for (let col=0; col<grid_length; col++) {
      all_cells.add(`cell-${row}-${col}`);
    } // for
  } // for

  // Iterate over entries, enabling cells that are used and remove
  // these cells from the list of all_cells
  entries.forEach(entry => {
    const {word, origin, orientation} = entry;
    for (let i=0; i<word.length; i++) {
      const row = origin.row + (orientation === "down" ? i : 0);
      const col = origin.col + (orientation === "across" ? i : 0);
      const cell_id = `cell-${row}-${col}`;
      all_cells.delete(cell_id);
    } // for
  }); //foreach

    // After all entries are seen, iterate over the rest of all_cells list
    all_cells.forEach(cell_id => {
      const cell = document.getElementById(cell_id);
      if(cell) {
        cell.classList.add("cell-disabled")
      } // if
    }); //foreach
} // function 