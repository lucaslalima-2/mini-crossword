import json

filename = "./crossword_export.json" # output json file

def export_clues_to_json(clues, size):
	# Convert each clue to a dictionary
	data = {"grid_length": size, "entries": None}
	entries = []

	# Builds entires & tile values
	for clue in clues:
		# Variables 
		word, row, col = clue.word, clue.origin[0], clue.origin[1]
		orientation, prompt = clue.orient, clue.prompt

		# Adds entry
		entry = {
			"word": word,
			"origin": {"row": row, "col": col},
			"orientation": orientation,
			"prompt": prompt
		}

		# Determines which cells are used
		used_cells = []
		if orientation == "across":
			print(f"word: {word}, row: {row}, col: {col}")
			for c in range(len(word)):
				used_cells.append([row, col+c])
		elif orientation == "down":
			for r in range(len(word)):
				used_cells.append([row + r, col])

		entry["used_cells"] = used_cells
		entries.append(entry)

	data["entries"] = entries

	# Write to JSON file
	with open(filename, "w") as f:
		json.dump(data, f, indent=2)

	print(f"Exported {len(entries)} clues to {filename}")
	return