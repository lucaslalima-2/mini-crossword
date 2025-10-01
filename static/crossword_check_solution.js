function crossowrd_check_solution() {
    let solved = true;
    for (let r=0; r<grid_length; r++) {
        for (let c=0; c<grid_length; c++) {
            const input = input_map[r][c];
            const solution = solution_map[r][c];

            if(!input || input.disabled) continue;

            const value = input.value.toUpperCase();
            if (value !== solution) {
                return false;
            }; // if
        }; // for
    }; //for
    return true;
} // function