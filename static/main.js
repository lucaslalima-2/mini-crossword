// Anchor at end of html code
window.onload = () => {
    crossword_create_grid();
    crossword_add_numbers();
    crossword_initialize_cells();
    crossword_fix_tab_bug(node_map, grid_length);
};