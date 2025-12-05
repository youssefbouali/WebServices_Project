#!/bin/bash
# Run Pylint code quality checks
# Usage: ./run_lint.sh

echo "Running Pylint on app/ directory..."
pylint app/

echo ""
echo "Pylint analysis complete!"
