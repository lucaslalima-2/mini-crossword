const container = document.getElementById("crossword-container");
const grid_length = crossword_json.grid_length;
const entries = crossword_json.entries;
const input_map = {};

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
      input.setAttribute("row", row);
      input.setAttribute("col", col);
      input.setAttribute("autocomplete", "off");
      input.setAttribute("spellcheck", "false");
      input.setAttribute("tabindex", "0");
      cell.appendChild(input);

      // Appends
      container.appendChild(cell)

      // Store inputs in input_map
      if (!input_map[row]) input_map[row] = {};
      input_map[row][col] = input;
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

// Disables unused cells (ie. makes them black)
// Sets pointer to first cell
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

    // Initializes pointer to first cell
    input_map[0][0].focus();
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
function crossword_overwrite_tab() {
  for (let row = 0; row < grid_length; row++) {
    for (let col = 0; col < grid_length; col++) {
      const input = input_map[row]?.[col];
      if (!input || input.disabled) continue;
      
      // Add tab behavior
      input.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();

          let delta = e.shiftKey ? -1 : 1;

          // Finds next available cell in row
          let next_cell = scan_board(row, col + delta, delta);
          if(next_cell) next_cell.focus();
        } // e.key tab
      }); // eventlistner
    } // for col
  } // for row
} // function

// Scans board for an enabled cell on [Tab] or input update
function scan_board(start_row, start_col, delta) {
  let row = start_row;
  while (row >= 0 && row < grid_length) {
    const input = scan_row(row, start_col, delta);
    if (input) return input;
    row += delta;
  } // while
  return null;
} // function

// Helper scan function that only scans row on [Tab]
function scan_row(row, col, delta){
  while( col >= 0 && col < grid_length) {
    const input = input_map[row]?.[col];
    if (input && !input.disabled) return input;
    col += delta;
  } // while
  return null;
}; // function

// Adds behavior to input to move to next cell
function crossword_add_input_behavior() {
  for (let row=0; row < grid_length; row++){
    for (let col=0; col < grid_length; col++){
      const input = input_map[row][col]

      // Overwrite behavior
      input.addEventListener("input", (e) => {
        const new_char = (e.data || input.value.slice(-1)).toUpperCase();
        input.value = new_char;
        // console.log(`Input at [${row}, ${col}]: ${new_char}`);
        const next_cell = scan_board(row, col+1, 1);
        if (next_cell) next_cell.focus();
      }); // addeventlistener

      // Arrow navigation behavior
      input.addEventListener("keydown", (e) => {
        let target = null;
        console.log("HERE :", e.key);
        switch(e.key){
          case "ArrowRight":
            target = scan_board(row, col+1, 1);
            break;
          case "ArrowLeft": 
            target = scan_board(row, col-1, -1);
            break;
        } // switch
        if(target) target.focus(); // Updates pointer
      }); //addeventlistener
    } // for col
  } // for row
}; //function