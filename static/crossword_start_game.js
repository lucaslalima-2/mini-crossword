function crossword_start_game() {
    const first_clue = cluemap.get("0-0-across");
    active_clue = first_clue;
    const { row, col } = first_clue.entry.origin;
    input_map[row][col].focus();
    highlight(first_clue.used_cells, row, col);
}; //function