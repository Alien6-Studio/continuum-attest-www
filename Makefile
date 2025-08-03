# Makefile for Attest Documentation

.PHONY: help install serve build clean

help:
	@echo "Available commands:"
	@echo "  install   Install dependencies"
	@echo "  serve     Serve documentation locally"
	@echo "  build     Build documentation"
	@echo "  clean     Clean build artifacts"

install:
	pip install -r requirements.txt

serve:
	mkdocs serve

build:
	mkdocs build

clean:
	rm -rf site/