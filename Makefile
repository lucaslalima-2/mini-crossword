VENV_NAME=venv

.PHONY: setup run clean

setup:
	python3 -m venv $(VENV_NAME)
	$(VENV_NAME)/bin/pip install --upgrade pip
	$(VENV_NAME)/bin/pip install -r requirements.txt

run:
	$(VENV_NAME)/bin/python3 app.py

loadbuild:
	$(VENV_NAME)/bin/python3 app.py --load_build

skipbuild:
	$(VENV_NAME)/bin/python3 app.py --skipbuild

debug:
	$(VENV_NAME)/bin/python3 app.py --skipbuild --debug

clean:
	rm -rf $(VENV_NAME)
