VENV_NAME=venv

.PHONY: setup run clean

setup:
	python3 -m venv $(VENV_NAME)
	$(VENV_NAME)/bin/pip install --upgrade pip
	$(VENV_NAME)/bin/pip install -r requirements.txt

run:
	$(VENV_NAME)/bin/python3 app.py

loadbuild:
	$(VENV_NAME)/bin/python3 app.py --loadbuild

skipbuild:
	$(VENV_NAME)/bin/python3 app.py --skipbuild

loadsolution:
	$(VENV_NAME)/bin/python3 app.py --loadsolution

clean:
	rm -rf $(VENV_NAME)
