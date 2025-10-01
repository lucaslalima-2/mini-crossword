function crossword_fill_board() {
    // Fills all cells but last word
    crossword_json.entries.forEach(entry => {
        const letters = entry.word.split("");
        // Only want to post one direction
        if(entry.orientation==="down") return;

        // Fills cells except last cell
        entry.used_cells.forEach(([row, col], i) => {
            const input = input_map[row][col];
            if(!input || input.disabled) return;
            if(row==grid_length-1 && col==grid_length-1) {
                input_map[row][col].focus();
                return;
            }; //if
            input.value = letters[i];
        }); //foreach
    }); //foreach
} // function