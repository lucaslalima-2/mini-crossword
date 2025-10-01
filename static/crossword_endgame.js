const banner = document.getElementById("endgame-banner");
const gameContainer = document.getElementById("game-container");

function crossword_endgame() {
	// Show banner
  banner.style.display = "block";

  // Dim game container
  gameContainer.style.opacity = "0.5";

	// Disable all inputs
  for (let r = 0; r < grid_length; r++) {
    for (let c = 0; c < grid_length; c++) {
      const input = input_map[r][c];
      if (input && !input.disabled) {
        input.classList.add("cell-input", "endgame");
				input.disabled = true;
      }; // if
    }; //for
  }; //for
	
	// Disable container cells
	for (let row = 0; row < grid_length; row++) {
		for (let col = 0; col < grid_length; col++) {
			const cell = document.getElementById(`cell-${row}-${col}`);
			if (cell) {
				cell.style.pointerEvents = "none"; // disables mouse interaction
			} ; //if
		}; // for
	}; //for
}; // function

// Add listener event to button
document.getElementById("explore-button").addEventListener("click", () => {
  for (let r = 0; r < grid_length; r++) {
    for (let c = 0; c < grid_length; c++) {
      const input = input_map[r][c];
      const cell = document.getElementById(`cell-${r}-${c}`);

      // Skip disabled cells
      if (cell && cell.classList.contains("cell-disabled")) continue;

      if (input) {
        input.disabled = false;                  // Re-enable input
        input.readOnly = true;
        input.classList.remove("endgame");       // Remove endgame lock
        input.classList.add("cell-explore");     // Add explore styling
        input.tabIndex = 0;
      }; //if

      if (cell) {
        cell.classList.remove("cell-endgame");
        cell.classList.add("cell-explore");
        cell.style.pointerEvents = "auto";       // Allow mouse interaction
      } //if
    }; //for
  }; //for

  // Disable backspace
  backspace_enabled = false;

  // Restore game container opacity and cursor
  gameContainer.style.opacity = "1";
  gameContainer.classList.remove("endgame-mode");

  // Remove display banner
  banner.style.display = "none";

  // Focus on first cell
  const firstInput = input_map[0][0];
  if (firstInput) firstInput.focus();
});
