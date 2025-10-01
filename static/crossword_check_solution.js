function crossword_check_solution() {
    let solved = true;
    for (let r=0; r<grid_length; r++) {
        for (let c=0; c<grid_length; c++) {
            const input = input_map[r][c];
            const solution = solution_map[r][c];

            if(!input || input.disabled || solution === null) continue;

            const value = input.value.toUpperCase();
            if (value !== solution) {
                solved = false;
                break;
            }; // if
        }; // for
    }; //for
    return solved;
} // function