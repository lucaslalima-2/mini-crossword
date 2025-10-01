// Anchor at end of html code
window.onload = () => {
    crossword_create_grid();
    crossword_add_numbers();
    crossword_initialize_cells();
    crossword_overwrite_tab();
    crossword_add_input_behavior();
    crossword_add_clue_columns();
    crossword_start_game();

    if(debug_mode) {
        crossword_fill_board();
    } // if
};