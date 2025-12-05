#!/bin/bash

# Cypress Test Runner Script for Docker
# This script helps run Cypress tests inside Docker containers

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Cypress E2E Tests - Docker Runner${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to check if frontend is running
check_frontend() {
    echo -e "${YELLOW}Checking if frontend service is running...${NC}"
    if ! docker ps | grep -q frontend_service; then
        echo -e "${RED}Frontend service is not running!${NC}"
        echo -e "${YELLOW}Starting frontend and required services...${NC}"
        docker-compose up -d frontend_service
        echo -e "${YELLOW}Waiting 30 seconds for services to be ready...${NC}"
        sleep 30
    else
        echo -e "${GREEN}Frontend service is already running ✓${NC}"
    fi
}

# Function to run Cypress tests
run_tests() {
    echo ""
    echo -e "${GREEN}Building and running Cypress tests...${NC}"
    docker-compose --profile testing run --rm cypress_tests
}

# Function to run Cypress tests with specific browser
run_tests_browser() {
    local browser=$1
    echo ""
    echo -e "${GREEN}Running Cypress tests with ${browser} browser...${NC}"
    docker-compose --profile testing run --rm cypress_tests npx cypress run --browser ${browser}
}

# Function to run specific test spec
run_specific_test() {
    local spec=$1
    echo ""
    echo -e "${GREEN}Running specific test: ${spec}${NC}"
    docker-compose --profile testing run --rm cypress_tests npx cypress run --spec "cypress/e2e/${spec}"
}

# Function to open Cypress UI (requires X11 forwarding on Linux)
open_cypress_ui() {
    echo ""
    echo -e "${YELLOW}Note: Cypress UI requires display forwarding${NC}"
    docker-compose --profile testing run --rm -e DISPLAY=$DISPLAY cypress_tests npx cypress open
}

# Function to clean up test artifacts
cleanup() {
    echo ""
    echo -e "${YELLOW}Cleaning up test artifacts...${NC}"
    rm -rf ./frontend/cypress/videos/*
    rm -rf ./frontend/cypress/screenshots/*
    echo -e "${GREEN}Cleanup complete ✓${NC}"
}

# Main menu
case "${1:-}" in
    "")
        # Default: run all tests
        check_frontend
        run_tests
        ;;
    "chrome")
        check_frontend
        run_tests_browser "chrome"
        ;;
    "firefox")
        check_frontend
        run_tests_browser "firefox"
        ;;
    "electron")
        check_frontend
        run_tests_browser "electron"
        ;;
    "spec")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Please specify a test spec file${NC}"
            echo "Usage: $0 spec <spec-file.cy.ts>"
            exit 1
        fi
        check_frontend
        run_specific_test "$2"
        ;;
    "ui")
        check_frontend
        open_cypress_ui
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  (none)          Run all Cypress tests (default)"
        echo "  chrome          Run tests with Chrome browser"
        echo "  firefox         Run tests with Firefox browser"
        echo "  electron        Run tests with Electron browser"
        echo "  spec <file>     Run a specific test spec file"
        echo "  ui              Open Cypress UI (requires display)"
        echo "  cleanup         Remove all test videos and screenshots"
        echo "  help            Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                          # Run all tests"
        echo "  $0 chrome                   # Run with Chrome"
        echo "  $0 spec login.cy.ts         # Run specific test"
        echo "  $0 cleanup                  # Clean artifacts"
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
echo -e "${YELLOW}Test videos: ./frontend/cypress/videos${NC}"
echo -e "${YELLOW}Screenshots: ./frontend/cypress/screenshots${NC}"
