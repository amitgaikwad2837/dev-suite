.PHONY: dev test lint
dev:
	flask --app shop run --port 8000 --debug
test:
	pytest -q
lint:
	ruff check .
