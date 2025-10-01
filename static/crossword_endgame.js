function crossword_endgame() {
	// Show banner
  const banner = document.getElementById("endgame-banner");
  banner.style.display = "block";

  // Dim game container
  const gameContainer = document.getElementById("game-container");
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
				cell.classList.add("cell-endgame");
				cell.style.pointerEvents = "none"; // disables mouse interaction
			} ; //if
		}; // for
	}; //for

}; // function