@echo off
REM Run tests with coverage
REM Usage: run_tests.bat

echo Running tests with coverage...
pytest --cov=app --cov-report=html --cov-report=term-missing --cov-report=xml

echo.
echo Coverage report generated in htmlcov\index.html
echo To view: open htmlcov\index.html in your browser
