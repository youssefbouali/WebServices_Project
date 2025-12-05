#!/bin/bash
# Run tests with coverage
# Usage: ./run_tests.sh

echo "Running tests with coverage..."
pytest --cov=app --cov-report=html --cov-report=term-missing --cov-report=xml

echo ""
echo "Coverage report generated in htmlcov/index.html"
echo "To view: open htmlcov/index.html (or start a local server)"
