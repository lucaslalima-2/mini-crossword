const container = document.getElementById("crossword-container");
const grid_length = crosswordJson.grid_length;

// Creates empty grid
function crossword_create_grid() {
  // Apply css grid styles dynamically
  container.style.gridTemplateColumns = `repeat(${grid_length}, 30px)`;
  container.style.gridTemplateRows = `repeat(${grid_length}, 30px)`;

  // Create grid cells
  for (let row=0; row<grid_length; row++){
    for (let col=0; col<grid_length; col++) {
      const cell = document.createElement("div");
      cell.className="cell";
      cell.id = `cell-${row}-${col}`;
      container.appendChild(cell)
    }; // for col
  }; //for row

  console.log("HERE");
}; //function
