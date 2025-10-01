# mini-crossword

## SETUP

This project uses [pyenv](https://github.com/pyenv/pyenv) to manage Python versions.

To match the development environment:

* bash
brew install pyenv
pyenv install $(cat .python-version)
pyenv local $(cat .python-version)

After setting up your python environment:
* make setup
* source venv/bin/activate

# USAGE
* To see full extent of my code, I suggest running: 
   * make skipbuild
* This will load a board identical to the one seen in example_crossword.png, except the last square. This will allow a demo of the endgame pretty quickly.

# FUTURE UPDATES
* During crossword_builder export; add before and after buttons to scan through all clues
* Introduce a tab perhaps with all clues visible and a text box under each clue for their propt/description
* Add a save button to generate the json
