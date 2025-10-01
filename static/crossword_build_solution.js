let solution_map = {};
function crossword_build_solution() {
    // Initialize empty grid
    solution_map = Array.from({ length: grid_length }, () =>
        Array(grid_length).fill(null)
    );

    // Fill in correct letters from entries
    crossword_json.entries.forEach(entry => {
        const letters = entry.word.toUpperCase().split("");
        let [row, col] = [entry.origin.row, entry.origin.col];

        letters.forEach(letter => {
            solution_map[row][col] = letter;
            if (entry.orientation === "across") {
                col++;
            } else {
                row++;
            }; // if-else
        });
    });
} // function