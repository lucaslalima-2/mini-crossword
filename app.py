# Libraries
import argparse

# Functions
from src.crossword_builder import CrosswordBuilder

def main():
	# Handles input
	parser = argparse.ArgumentParser(description="Luke's Crossword")
	parser.add_argument("-d", "--debug", action="store_true", help="Debug")
	args = parser.parse_args()

	cb = CrosswordBuilder(args.debug)
	return

if __name__ == "__main__":
	main()