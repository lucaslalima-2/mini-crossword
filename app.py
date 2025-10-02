# Libraries
import argparse, os, json, threading
from flask import Flask, render_template

# Functions
from src.crossword_builder import CrosswordBuilder
from src.open_browser import open_browser

# Variables
json_path = "./crossword_export.json" # Target json to build
ADD_SOLUTION = False # Flag to add solution to json

# Application start
app = Flask(__name__)
app.secret_key = os.environ.get("DEV_SECRET_KEY")

# === App Routing ===
@app.route("/")
def index():
	with open(json_path, "r") as f:
		crossword_json = json.load(f)
	debug_flag = "--debug" in os.sys.argv
	return render_template("index.html", crossword=crossword_json, debugflag=ADD_SOLUTION)

# === Main === 
def main():
	# Handles input
	parser = argparse.ArgumentParser(description="Luke's Crossword")
	parser.add_argument("-d", "--debug", action="store_true", help="Debug")
	parser.add_argument("-s", "--skipbuild", action="store_true", help="Skips Crossword Builder GUI")
	parser.add_argument("-l", "--loadbuild", action="store_true", help="Loads Crossword Builder GUI")
	parser.add_argument("-ls", "--loadsolution", action="store_true", help="Loads solution json")
	args = parser.parse_args()

	# GUI to construct json
	if not args.skipbuild and args.loadbuild:
		cb = CrosswordBuilder(debug=args.loadbuild)
		
	# Loads solution
	if args.loadsolution:
		global ADD_SOLUTION
		ADD_SOLUTION = True

	# Run app
	threading.Timer(1.0, open_browser).start()
	app.run(debug=True, use_reloader=False, port=5000)
	return

# === Anchor ===
if __name__ == "__main__":
	main()
