VENV_NAME=venv

.PHONY: setup run clean

setup:
	python3 -m venv $(VENV_NAME)
	$(VENV_NAME)/bin/pip install --upgrade pip
	$(VENV_NAME)/bin/pip install -r requirements.txt

run:
	$(VENV_NAME)/bin/python3 app.py

debug:
	$(VENV_NAME)/bin/python3 app.py --debug

skipbuild:
	$(VENV_NAME)/bin/python3 app.py --debug --skipbuild

clean:
	rm -rf $(VENV_NAME)
