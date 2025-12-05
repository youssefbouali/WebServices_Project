# Cypress Test Runner Script for Docker (PowerShell)
# This script helps run Cypress tests inside Docker containers

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
Write-ColorOutput Green "  Cypress E2E Tests - Docker Runner"
Write-ColorOutput Green "========================================"
Write-Output ""

# Function to check if frontend is running
function Check-Frontend {
    Write-ColorOutput Yellow "Checking if frontend service is running..."
    $frontendRunning = docker ps | Select-String "frontend_service"
    
    if (-not $frontendRunning) {
        Write-ColorOutput Red "Frontend service is not running!"
        Write-ColorOutput Yellow "Starting frontend and required services..."
        docker-compose up -d frontend_service
        Write-ColorOutput Yellow "Waiting 30 seconds for services to be ready..."
        Start-Sleep -Seconds 30
    } else {
        Write-ColorOutput Green "Frontend service is already running ✓"
    }
}

# Function to run Cypress tests
function Run-Tests {
    Write-Output ""
    Write-ColorOutput Green "Building and running Cypress tests..."
    docker-compose --profile testing run --rm cypress_tests
}

# Function to run Cypress tests with specific browser
function Run-TestsBrowser($browser) {
    Write-Output ""
    Write-ColorOutput Green "Running Cypress tests with $browser browser..."
    docker-compose --profile testing run --rm cypress_tests npx cypress run --browser $browser
}

# Function to run specific test spec
function Run-SpecificTest($spec) {
    Write-Output ""
    Write-ColorOutput Green "Running specific test: $spec"
    docker-compose --profile testing run --rm cypress_tests npx cypress run --spec "cypress/e2e/$spec"
}

# Function to clean up test artifacts
function Cleanup {
    Write-Output ""
    Write-ColorOutput Yellow "Cleaning up test artifacts..."
    
    if (Test-Path "./frontend/cypress/videos") {
        Remove-Item -Path "./frontend/cypress/videos/*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    if (Test-Path "./frontend/cypress/screenshots") {
        Remove-Item -Path "./frontend/cypress/screenshots/*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Write-ColorOutput Green "Cleanup complete ✓"
}

# Function to show help
function Show-Help {
    Write-Output "Usage: .\run-cypress-tests.ps1 [command] [options]"
    Write-Output ""
    Write-Output "Commands:"
    Write-Output "  (none)          Run all Cypress tests (default)"
    Write-Output "  chrome          Run tests with Chrome browser"
    Write-Output "  firefox         Run tests with Firefox browser"
    Write-Output "  electron        Run tests with Electron browser"
    Write-Output "  spec <file>     Run a specific test spec file"
    Write-Output "  cleanup         Remove all test videos and screenshots"
    Write-Output "  help            Show this help message"
    Write-Output ""
    Write-Output "Examples:"
    Write-Output "  .\run-cypress-tests.ps1                    # Run all tests"
    Write-Output "  .\run-cypress-tests.ps1 chrome             # Run with Chrome"
    Write-Output "  .\run-cypress-tests.ps1 spec login.cy.ts   # Run specific test"
    Write-Output "  .\run-cypress-tests.ps1 cleanup            # Clean artifacts"
}

# Main logic
switch ($Command.ToLower()) {
    "" {
        # Default: run all tests
        Check-Frontend
        Run-Tests
    }
    "chrome" {
        Check-Frontend
        Run-TestsBrowser "chrome"
    }
    "firefox" {
        Check-Frontend
        Run-TestsBrowser "firefox"
    }
    "electron" {
        Check-Frontend
        Run-TestsBrowser "electron"
    }
    "spec" {
        if ([string]::IsNullOrEmpty($Argument)) {
            Write-ColorOutput Red "Error: Please specify a test spec file"
            Write-Output "Usage: .\run-cypress-tests.ps1 spec <spec-file.cy.ts>"
            exit 1
        }
        Check-Frontend
        Run-SpecificTest $Argument
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
        Write-Output "Run '.\run-cypress-tests.ps1 help' for usage information"
        exit 1
    }
}

Write-Output ""
Write-ColorOutput Green "Done!"
Write-ColorOutput Yellow "Test videos: ./frontend/cypress/videos"
Write-ColorOutput Yellow "Screenshots: ./frontend/cypress/screenshots"
