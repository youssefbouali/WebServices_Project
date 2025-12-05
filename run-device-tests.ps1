# Device Testing Script for Docker (PowerShell)
# This script helps run pytest, coverage, and Locust tests inside Docker

param(
    [Parameter(Position=0)]
    [string]$Command = "",
    
    [Parameter(Position=1)]
    [string]$Argument = ""
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "========================================"
Write-ColorOutput Green "  Device Service Testing - Docker"
Write-ColorOutput Green "========================================"
Write-Output ""

# Function to check if database is running
function Check-Database {
    Write-ColorOutput Yellow "Checking if database services are running..."
    $dbRunning = docker ps | Select-String "device_db"
    
    if (-not $dbRunning) {
        Write-ColorOutput Red "Database service is not running!"
        Write-ColorOutput Yellow "Starting database services..."
        docker-compose up -d device_db influxdb
        Write-ColorOutput Yellow "Waiting 15 seconds for databases to be ready..."
        Start-Sleep -Seconds 15
    } else {
        Write-ColorOutput Green "Database services are running ✓"
    }
}

# Function to run pytest with coverage
function Run-Tests {
    Write-Output ""
    Write-ColorOutput Green "Running pytest with coverage..."
    docker-compose --profile testing run --rm device_tests
}

# Function to run specific test file
function Run-SpecificTest($testFile) {
    Write-Output ""
    Write-ColorOutput Green "Running specific test: $testFile"
    docker-compose --profile testing run --rm device_tests pytest "tests/$testFile" -v
}

# Function to run tests with specific marker
function Run-MarkedTests($marker) {
    Write-Output ""
    Write-ColorOutput Green "Running tests with marker: $marker"
    docker-compose --profile testing run --rm device_tests pytest -m $marker -v
}

# Function to run only coverage report
function Run-Coverage {
    Write-Output ""
    Write-ColorOutput Green "Generating coverage report..."
    docker-compose --profile testing run --rm device_tests coverage report
}

# Function to start Locust in web UI mode
function Start-Locust {
    Write-Output ""
    Write-ColorOutput Green "Starting Locust load testing web UI..."
    Write-ColorOutput Yellow "Access the web UI at: http://localhost:8089"
    Write-ColorOutput Yellow "Press Ctrl+C to stop"
    docker-compose --profile testing up device_locust
}

# Function to run Locust in headless mode
function Run-Locust($users, $spawnRate, $runTime) {
    Write-Output ""
    Write-ColorOutput Green "Running Locust in headless mode..."
    Write-ColorOutput Yellow "Users: $users, Spawn Rate: $spawnRate, Run Time: $runTime"
    
    docker-compose --profile testing run --rm device_locust `
        locust -f locustfile.py `
        --host=http://device_service:8000 `
        --users=$users `
        --spawn-rate=$spawnRate `
        --run-time=$runTime `
        --headless `
        --html=locust_report.html
}

# Function to run pylint
function Run-Lint {
    Write-Output ""
    Write-ColorOutput Green "Running pylint code quality checks..."
    docker-compose --profile testing run --rm device_tests pylint app
}

# Function to clean up test artifacts
function Cleanup {
    Write-Output ""
    Write-ColorOutput Yellow "Cleaning up test artifacts..."
    
    if (Test-Path "./device/htmlcov") {
        Remove-Item -Path "./device/htmlcov" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "./device/coverage_reports") {
        Remove-Item -Path "./device/coverage_reports" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "./device/test_reports") {
        Remove-Item -Path "./device/test_reports" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "./device/coverage.xml") {
        Remove-Item -Path "./device/coverage.xml" -Force -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "./device/.coverage") {
        Remove-Item -Path "./device/.coverage" -Force -ErrorAction SilentlyContinue
    }
    
    Write-ColorOutput Green "Cleanup complete ✓"
}

# Function to show help
function Show-Help {
    Write-Output "Usage: .\run-device-tests.ps1 [command] [options]"
    Write-Output ""
    Write-Output "Commands:"
    Write-Output "  test              Run all pytest tests with coverage (default)"
    Write-Output "  test-file <file>  Run specific test file"
    Write-Output "  test-unit         Run only unit tests"
    Write-Output "  test-integration  Run only integration tests"
    Write-Output "  coverage          Generate coverage report"
    Write-Output "  locust            Start Locust web UI"
    Write-Output "  locust-run        Run Locust in headless mode"
    Write-Output "  lint              Run pylint code quality checks"
    Write-Output "  cleanup           Remove all test artifacts"
    Write-Output "  help              Show this help message"
    Write-Output ""
    Write-Output "Examples:"
    Write-Output "  .\run-device-tests.ps1                      # Run all tests"
    Write-Output "  .\run-device-tests.ps1 test-file test_api.py  # Run specific test"
    Write-Output "  .\run-device-tests.ps1 test-unit            # Run unit tests only"
    Write-Output "  .\run-device-tests.ps1 locust               # Start Locust UI"
    Write-Output "  .\run-device-tests.ps1 locust-run           # Run load test"
    Write-Output "  .\run-device-tests.ps1 lint                 # Run code quality checks"
    Write-Output "  .\run-device-tests.ps1 cleanup              # Clean artifacts"
}

# Main logic
switch ($Command.ToLower()) {
    "" {
        # Default: run all tests
        Check-Database
        Run-Tests
    }
    "test" {
        Check-Database
        Run-Tests
    }
    "test-file" {
        if ([string]::IsNullOrEmpty($Argument)) {
            Write-ColorOutput Red "Error: Please specify a test file"
            Write-Output "Usage: .\run-device-tests.ps1 test-file <test_file.py>"
            exit 1
        }
        Check-Database
        Run-SpecificTest $Argument
    }
    "test-unit" {
        Check-Database
        Run-MarkedTests "unit"
    }
    "test-integration" {
        Check-Database
        Run-MarkedTests "integration"
    }
    "coverage" {
        Check-Database
        Run-Coverage
    }
    "locust" {
        # Check if device service is running
        $serviceRunning = docker ps | Select-String "device_service"
        if (-not $serviceRunning) {
            Write-ColorOutput Yellow "Starting device service..."
            docker-compose up -d device_service
            Start-Sleep -Seconds 10
        }
        Start-Locust
    }
    "locust-run" {
        # Check if device service is running
        $serviceRunning = docker ps | Select-String "device_service"
        if (-not $serviceRunning) {
            Write-ColorOutput Yellow "Starting device service..."
            docker-compose up -d device_service
            Start-Sleep -Seconds 10
        }
        Run-Locust 10 2 "60s"
    }
    "lint" {
        Run-Lint
    }
    "cleanup" {
        Cleanup
    }
    "help" {
        Show-Help
    }
    "-h" {
        Show-Help
    }
    "--help" {
        Show-Help
    }
    default {
        Write-ColorOutput Red "Unknown command: $Command"
        Write-Output "Run '.\run-device-tests.ps1 help' for usage information"
        exit 1
    }
}

Write-Output ""
Write-ColorOutput Green "Done!"
Write-ColorOutput Yellow "Coverage report: ./device/htmlcov/index.html"
Write-ColorOutput Yellow "Coverage XML: ./device/coverage.xml"
