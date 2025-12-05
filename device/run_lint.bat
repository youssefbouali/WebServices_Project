@echo off
REM Run Pylint code quality checks
REM Usage: run_lint.bat

echo Running Pylint on app\ directory...
pylint app\

echo.
echo Pylint analysis complete!
