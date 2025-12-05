#!/bin/bash

# Device Testing Script for Docker (Bash)
# This script helps run pytest, coverage, and Locust tests inside Docker

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Device Service Testing - Docker${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to check if database is running
check_database() {
    echo -e "${YELLOW}Checking if database services are running...${NC}"
    if ! docker ps | grep -q device_db; then
        echo -e "${RED}Database service is not running!${NC}"
        echo -e "${YELLOW}Starting database services...${NC}"
        docker-compose up -d device_db influxdb
        echo -e "${YELLOW}Waiting 15 seconds for databases to be ready...${NC}"
        sleep 15
    else
        echo -e "${GREEN}Database services are running ✓${NC}"
    fi
}

# Function to run pytest with coverage
run_tests() {
    echo ""
    echo -e "${GREEN}Running pytest with coverage...${NC}"
    docker-compose --profile testing run --rm device_tests
}

# Function to run specific test file
run_specific_test() {
    local test_file=$1
    echo ""
    echo -e "${GREEN}Running specific test: ${test_file}${NC}"
    docker-compose --profile testing run --rm device_tests pytest "tests/${test_file}" -v
}

# Function to run tests with specific marker
run_marked_tests() {
    local marker=$1
    echo ""
    echo -e "${GREEN}Running tests with marker: ${marker}${NC}"
    docker-compose --profile testing run --rm device_tests pytest -m "${marker}" -v
}

# Function to run only coverage report
run_coverage() {
    echo ""
    echo -e "${GREEN}Generating coverage report...${NC}"
    docker-compose --profile testing run --rm device_tests coverage report
}

# Function to start Locust in web UI mode
start_locust() {
    echo ""
    echo -e "${GREEN}Starting Locust load testing web UI...${NC}"
    echo -e "${YELLOW}Access the web UI at: http://localhost:8089${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    docker-compose --profile testing up device_locust
}

# Function to run Locust in headless mode
run_locust() {
    local users=${1:-10}
    local spawn_rate=${2:-2}
    local run_time=${3:-60s}
    
    echo ""
    echo -e "${GREEN}Running Locust in headless mode...${NC}"
    echo -e "${YELLOW}Users: ${users}, Spawn Rate: ${spawn_rate}, Run Time: ${run_time}${NC}"
    
    docker-compose --profile testing run --rm device_locust \
        locust -f locustfile.py \
        --host=http://device_service:8000 \
        --users="${users}" \
        --spawn-rate="${spawn_rate}" \
        --run-time="${run_time}" \
        --headless \
        --html=locust_report.html
}

# Function to run pylint (using test container)
run_lint() {
    echo ""
    echo -e "${GREEN}Running pylint code quality checks...${NC}"
    docker-compose --profile testing run --rm device_tests pylint app
}

# Function to run pylint (using dedicated pylint container)
run_lint_dedicated() {
    echo ""
    echo -e "${GREEN}Running pylint with dedicated container...${NC}"
    docker-compose --profile testing run --rm device_pylint
}

# Function to clean up test artifacts
cleanup() {
    echo ""
    echo -e "${YELLOW}Cleaning up test artifacts...${NC}"
    
    rm -rf ./device/htmlcov
    rm -rf ./device/coverage_reports
    rm -rf ./device/test_reports
    rm -f ./device/coverage.xml
    rm -f ./device/.coverage
    
    echo -e "${GREEN}Cleanup complete ✓${NC}"
}

# Function to show help
show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  test              Run all pytest tests with coverage (default)"
    echo "  test-file <file>  Run specific test file"
    echo "  test-unit         Run only unit tests"
    echo "  test-integration  Run only integration tests"
    echo "  coverage          Generate coverage report"
    echo "  locust            Start Locust web UI"
    echo "  locust-run        Run Locust in headless mode"
    echo "  lint              Run pylint code quality checks"
    echo "  lint-only         Run pylint with dedicated container (faster)"
    echo "  cleanup           Remove all test artifacts"
    echo "  help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Run all tests"
    echo "  $0 test-file test_api.py  # Run specific test"
    echo "  $0 test-unit            # Run unit tests only"
    echo "  $0 locust               # Start Locust UI"
    echo "  $0 locust-run           # Run load test"
    echo "  $0 lint                 # Run code quality checks"
    echo "  $0 lint-only            # Run pylint only (dedicated)"
    echo "  $0 cleanup              # Clean artifacts"
}

# Main logic
case "${1:-}" in
    "")
        # Default: run all tests
        check_database
        run_tests
        ;;
    "test")
        check_database
        run_tests
        ;;
    "test-file")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Please specify a test file${NC}"
            echo "Usage: $0 test-file <test_file.py>"
            exit 1
        fi
        check_database
        run_specific_test "$2"
        ;;
    "test-unit")
        check_database
        run_marked_tests "unit"
        ;;
    "test-integration")
        check_database
        run_marked_tests "integration"
        ;;
    "coverage")
        check_database
        run_coverage
        ;;
    "locust")
        # Check if device service is running
        if ! docker ps | grep -q device_service; then
            echo -e "${YELLOW}Starting device service...${NC}"
            docker-compose up -d device_service
            sleep 10
        fi
        start_locust
        ;;
    "locust-run")
        # Check if device service is running
        if ! docker ps | grep -q device_service; then
            echo -e "${YELLOW}Starting device service...${NC}"
            docker-compose up -d device_service
            sleep 10
        fi
        run_locust 10 2 "60s"
        ;;
    "lint")
        run_lint
        ;;
    "lint-only")
        run_lint_dedicated
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
echo -e "${YELLOW}Coverage report: ./device/htmlcov/index.html${NC}"
echo -e "${YELLOW}Coverage XML: ./device/coverage.xml${NC}"
