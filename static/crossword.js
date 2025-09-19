const container = document.getElementById("crossword-container");
const grid_length = crossword_json.grid_length;
const entries = crossword_json.entries;
const node_map = {};

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
      cellnum.setAttribute("tabindex", "-1");
      cell.appendChild(cellnum);

      // Adds input box for letter entry
      const input = document.createElement("input");
      input.className = "cell-input";
      input.setAttribute("maxlength", "1"); // only one letter
      input.setAttribute("row", row);
      input.setAttribute("col", col);
      input.setAttribute("autocomplete", "off");
      input.setAttribute("spellcheck", "false");
      input.setAttribute("tabindex", "0");
      cell.appendChild(input);

      // Appends
      container.appendChild(cell)

      // Store inputs in node_map
      if (!node_map[row]) node_map[row] = {};
      node_map[row][col] = input;
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
      // Enables
      const cell = document.getElementById(cell_id);
      if (cell) {
        cell.classList.add("cell-enabled");
        cell.setAttribute("contenteditable", "true");
      } // if
      // Removes from list
      all_cells.delete(cell_id); 
    } // for
  }); //foreach

    // After all entries are seen, iterate over the rest of all_cells list
    all_cells.forEach(cell_id => {
      const cell = document.getElementById(cell_id);
      if(cell) {
        cell.classList.add("cell-disabled") // changes color
        const input = cell.querySelector(".cell-input");
        if(input) {
          input.disabled = true
          input.setAttribute("tabindex", "-1");
        } // if
      } // if
    }); //foreach
} // function

// Work-around for [Tab] bug; add behavior to all inputs
// [Tab] is focusing on the cell-number
function crossword_fix_tab_bug() {
  for (let row = 0; row < grid_length; row++) {
    for (let col = 0; col < grid_length; col++) {
      const input = node_map[row]?.[col];
      if (!input || input.disabled) continue;
      
      // Add behavior
      input.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();

          let delta = e.shiftKey ? -1 : 1;

          // Finds next available cell in row
          let next_cell = scan_row(row, col + delta, delta);
          if (next_cell) {
            next_cell.focus();
            return;
          }; // else 
          
          // If none, scan subsequent rows until one has an enabled cell
          let next_row = row + delta;
          while (next_row >= 0 && next_row < grid_length ) {
            const fallback = scan_board(next_row, delta);
            if (fallback) {
              fallback.focus();
              return;
            } //if
            next_row += delta;
          } // while
        } // e.key tab
      }); // eventlistner
    } // for col
  } // for row
} // function

function scan_board(start_row, delta) {
  const start_col = delta > 0 ? 0 : grid_length - 1;
  return scan_row(start_row, start_col, delta);
} // function

function scan_row(row, col, delta){
  while(
    col >= 0 &&
    col < grid_length
  ) {
    const input = node_map[row]?.[col];
    if (input && !input.disabled) return input;
    col += delta;
  } // while

  return null;
}; // function 