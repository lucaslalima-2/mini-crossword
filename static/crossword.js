const container = document.getElementById("crossword-container");
const grid_length = crossword_json.grid_length;

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
  const entries = crossword_json.entries;

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