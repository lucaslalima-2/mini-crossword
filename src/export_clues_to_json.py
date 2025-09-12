import json

filename = "./crossword_export_debug.json"

def export_clues_to_json(clues, size):
	# Convert each clue to a dictionary
	data = {"grid_length": size, "entries": None}
	entires = []

	# Builds entires value
	for clue in clues:
		clue_data = {
			"word": clue.word,
			"origin": {"row": clue.origin[0], "col": clue.origin[1]},
			"orientation": clue.orient,
			"prompt": clue.prompt
		}
		entries.append(clue_data)

	data["entries"] = entries

	# Write to JSON file
	with open(filename, "w") as f:
		json.dump(data, f, indent=2)

	print(f"Exported {len(data)} clues to {filename}")
