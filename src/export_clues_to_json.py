import json

def export_clues_to_json(clues):
	# Convert each clue to a dictionary
	data = []
	filename = "crossword_export.json"
	for clue in clues:
		clue_data = {
			"word": clue.word,
			"origin": {"row": clue.origin[0], "col": clue.origin[1]},
			"orientation": clue.orient,
			"prompt": clue.prompt
		}
		data.append(clue_data)

	# Write to JSON file
	with open(filename, "w") as f:
		json.dump(data, f, indent=2)

	print(f"Exported {len(data)} clues to {filename}")