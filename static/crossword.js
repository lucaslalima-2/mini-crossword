let active_clue = null; // stores active clue
const clue_list_across = document.getElementById("clue-list-across");
const clue_list_down = document.getElementById("clue-list-down");
const cluemap = new Map();
const container = document.getElementById("crossword-container");
const current_clue_container =   document.getElementById("current-clue-container");
const entries = crossword_json.entries;
const grid_length = crossword_json.grid_length;
const input_map = {};
let last_direction = "across";

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
// Builds cluemap
function crossword_add_numbers() {
  let index = 1;

  // Builds cluemap
  entries.forEach(entry => {
    const key = `${entry.origin.row}-${entry.origin.col}-${entry.orientation}`;
    cluemap.set(key, {
      word: entry.word,
      orientation: entry.orientation,
      prompt: entry.prompt,
      used_cells: entry.used_cells,
      entry: entry,
      index: null // placeholder for clue number
    }); // set
  }); //foreach

  // Iterates over all cells & stamps number if clue exists
  for (let row=0; row<grid_length; row++) {
    for(let col=0; col<grid_length; col++){
      const cell = document.getElementById(`cell-${row}-${col}`);
      const numspan = cell.querySelector(".cell-number");
      const key_across = `${row}-${col}-across`;
      const key_down = `${row}-${col}-down`;
      const has_across = cluemap.has(key_across);
      const has_down = cluemap.has(key_down);

      if (has_across || has_down) {
        numspan.textContent = index;
        // updates cluemap[key] for final number indicator (ie. "1-across", "47-down", etc.)
        ["across", "down"].forEach(orientation => {
          const key = `${row}-${col}-${orientation}`;
          if (cluemap.has(key)) {
            cluemap.get(key).index = index;
          };//if
        }); // foreach
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

          let coldelta = e.shiftKey ? -1 : 1;

          // Finds next available cell in row
          let next_cell = scan_direction(row, col+coldelta, 0, coldelta);
          if(next_cell) next_cell.focus();
        } // e.key tab
      }); // eventlistner
    } // for col
  } // for row
} // function

// Scanning function used for [Tab] and arrows
function scan_direction(row, col, rowdelta, coldelta) {
  while( row >= 0 && row < grid_length && col >= 0 && col < grid_length) {
    const input = input_map[row]?.[col];
    if (input && !input.disabled) return input;
    row += rowdelta;
    col += coldelta
  }// while

  // Handles wraparounds
  if(rowdelta<=0 && coldelta<=0 && row<=0 && col<=0) { return scan_direction(grid_length-1, grid_length-1, 0, -1); } // left/up-arrow from top-left corner
  if(rowdelta>=0 && coldelta>=0 && row>=grid_length-1 && col>=grid_length-1) { return scan_direction(0, 0, 0, 1); } // right/down-arrow from top-left corner
  if(rowdelta===0 && coldelta===1 && col >= grid_length) { return scan_direction(row+1, 0, 0, 1); } // right-edge, next row
  if(rowdelta===0 && coldelta===-1 && col < 0) { return scan_direction(row-1, grid_length-1, 0, -1); } // left-edge, prev row
  if(rowdelta===-1 && row < 0) { return scan_direction(grid_length-1, col-1, -1, 0); } // top-edge, bottom of col to the left
  if(rowdelta===1 && row >= grid_length) { return scan_direction(0, col+1, 1, 0); } // bot-edge, top of col to the right
  return null;
} // function

// Adds behavior to input to move to next cell
function crossword_add_input_behavior() {
  for (let row=0; row < grid_length; row++){
    for (let col=0; col < grid_length; col++){
      const input = input_map[row][col]

      // Overwrite behavior
      input.addEventListener("input", (e) => {
        const new_char = (e.data || input.value.slice(-1)).toUpperCase();
        input.value = new_char;
        const next_cell = scan_direction(row, col+1, 0, 1);
        if (next_cell) next_cell.focus();
      }); // addeventlistener

      // Focus behavior
      input.addEventListener("focus", () => {
        let matched_clue = null;

        for(const [key, clue] of cluemap.entries()) {
          const matches_cell = clue.used_cells.some(([r, c]) => r===row && c===col);
          const matches_direction = clue.orientation === last_direction;

          if (matches_cell && matches_direction) {
            matched_clue = clue;
            break;
          } // if
        } // for

        if (matched_clue) {
          clear_highlight();
          highlight(matched_clue.used_cells, row, col)
        } else {
          active_clue = null;
          clear_highlight()
        } // if-else


      }); // addeventlistener

      // Arrow navigation behavior
      input.addEventListener("keydown", (e) => {
        let target = null;
        switch(e.key){
          case "ArrowRight":
            last_direction = "across";
            target = scan_direction(row, col+1, 0, 1);
            break;
          case "ArrowLeft": 
            last_direction = "across";
            target = scan_direction(row, col-1, 0, -1);
            break;
          case "ArrowUp":
            last_direction = "down";
            target = scan_direction(row-1, col, -1, 0);
            break;
          case "ArrowDown":
            last_direction = "down";
            target = scan_direction(row+1, col, 1, 0);
            break;
        } // switch
        if(target) {
          e.preventDefault(); // prevent scroll
          target.focus(); // Updates pointer
        }; //if
      }); //addeventlistener

      // Backspace behavior
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
          e.preventDefault();
          // Case 1: Cell has char; delete it and stay in place
          if (input.value) {
            input.value = "";
          } else { // Case 2: Cell is empty; clear left-neighbor cell
            const prev = scan_direction(row, col-1, 0, -1);
            prev.value = "";
            prev.focus();
          }; // if-else
        }; //if
      }); // e, addeventlistener 
    } // for col
  } // for row
}; //function

// Adds clues to columns
function crossword_add_clue_columns() {
  // Convert cluemap to array and sort by clue number
  const sorted_clues = Array.from(cluemap.entries())
    .filter(([_, clue]) => clue.index !== null)
    .sort((a, b) => a[1].index - b[1].index);
  
  // Render each clue
  sorted_clues.forEach(([key, clue]) => {
    const div = document.createElement("div");
    div.className = "clue-item";
    div.setAttribute("clue-key", key);
    div.innerHTML = `<strong>${clue.index}</strong> ${clue.prompt}`;

    // Appends to correct column
    if (clue.orientation === "across") {
      clue_list_across.appendChild(div);
    } else if (clue.orientation === "down") {
      clue_list_down.appendChild(div);
    }; // if-else

    // Adds click-behavior
    div.addEventListener("click", () => {
      // Fetches clue data
      const clue = cluemap.get(key);
      if(!clue) return;
      
      // Updates globals
      active_clue = clue;
      last_direction = clue.orientation;
      
      // Sets focus + highlight
      const { entry: { origin: { row, col } } } = clue;
      input_map[row][col].focus();
      clear_highlight();
      highlight(clue.used_cells, row, col);
    }); // addeventlistener
  }); // forEach
}// function

// Focuses cursor on crossword grid & updates current clue text
function crossword_focus(clue){
  const { entry: { origin: { row, col } } } = clue;
  // Focuses
  input_map[row][col].focus();
  //Updates current-clue-container
  current_clue_container.innerHTML = `<strong>${clue.index}</strong> ${clue.prompt}`;
} // function

// Highlights input cells
function highlight(cells, cursor_row, cursor_col){
  cells.forEach( ([row, col]) => {
    const input = input_map?.[row]?.[col];
    if (!input) return;

    // Highlights row/col with respect to main pointer
    if (row===cursor_row && col === cursor_col) {
      input.classList.add("cell-cursor-highlight");
    } else {
      input.classList.add("cell-highlight");
    } // if-else
  }); //foreach
}// function

// Clear highlights
function clear_highlight() {
  document.querySelectorAll(".cell-highlight, .cell-cursor-highlight").forEach(input => {
    input.classList.remove("cell-highlight", "cell-cursor-highlight");
  }); 
} // function