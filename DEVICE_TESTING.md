# Device Service Testing with Docker

Complete guide for running pytest, Coverage.py, and Locust load tests for the Device Service inside Docker containers.

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
# Run all tests with coverage
.\run-device-tests.ps1

# Run specific test file
.\run-device-tests.ps1 test-file test_api.py

# Run unit tests only
.\run-device-tests.ps1 test-unit

# Start Locust web UI
.\run-device-tests.ps1 locust

# Run code quality checks
.\run-device-tests.ps1 lint
```

### Linux/Mac (Bash)
```bash
# Make script executable (first time only)
chmod +x run-device-tests.sh

# Run all tests with coverage
./run-device-tests.sh

# Run specific test file
./run-device-tests.sh test-file test_api.py

# Run unit tests only
./run-device-tests.sh test-unit

# Start Locust web UI
./run-device-tests.sh locust

# Run code quality checks
./run-device-tests.sh lint
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `test` | Run all pytest tests with coverage (default) |
| `test-file <file>` | Run specific test file |
| `test-unit` | Run only unit tests (marked with @pytest.mark.unit) |
| `test-integration` | Run only integration tests (marked with @pytest.mark.integration) |
| `coverage` | Generate coverage report |
| `locust` | Start Locust web UI for interactive load testing |
| `locust-run` | Run Locust in headless mode (10 users, 60s) |
| `lint` | Run pylint code quality checks |
| `cleanup` | Remove all test artifacts |
| `help` | Show help message |

## 🧪 Testing Tools

### 1. Pytest with Coverage.py

#### Run All Tests
```bash
# Using helper script
./run-device-tests.sh test

# Direct Docker Compose
docker-compose --profile testing run --rm device_tests
```

#### Run Specific Test File
```bash
# Using helper script
./run-device-tests.sh test-file test_api.py

# Direct Docker Compose
docker-compose --profile testing run --rm device_tests pytest tests/test_api.py -v
```

#### Run Tests by Marker
```bash
# Unit tests only
./run-device-tests.sh test-unit

# Integration tests only
./run-device-tests.sh test-integration

# Direct Docker Compose
docker-compose --profile testing run --rm device_tests pytest -m unit -v
docker-compose --profile testing run --rm device_tests pytest -m integration -v
```

#### Run Tests with Specific Options
```bash
# Verbose output
docker-compose --profile testing run --rm device_tests pytest -v

# Stop on first failure
docker-compose --profile testing run --rm device_tests pytest -x

# Run last failed tests
docker-compose --profile testing run --rm device_tests pytest --lf

# Show local variables in tracebacks
docker-compose --profile testing run --rm device_tests pytest -l
```

### 2. Coverage.py

#### View Coverage Report
```bash
# Generate and view coverage
./run-device-tests.sh coverage

# Direct Docker Compose
docker-compose --profile testing run --rm device_tests coverage report
```

#### Coverage Output Formats

The tests automatically generate coverage in multiple formats:

1. **HTML Report**: `./device/htmlcov/index.html`
   - Interactive, detailed coverage report
   - Open in browser to view

2. **Terminal Output**: Shows coverage summary with missing lines

3. **XML Report**: `./device/coverage.xml`
   - For CI/CD integration
   - Compatible with SonarQube, CodeCov, etc.

#### Coverage Configuration

Coverage is configured in `.coveragerc`:
- **Source**: `app/` directory
- **Omit**: Tests, migrations, virtual environments
- **Minimum Coverage**: 70% (configurable in `pytest.ini`)

### 3. Locust Load Testing

#### Interactive Web UI Mode
```bash
# Using helper script
./run-device-tests.sh locust

# Direct Docker Compose
docker-compose --profile testing up device_locust
```

Then open your browser to: **http://localhost:8089**

In the web UI:
1. Set number of users (e.g., 100)
2. Set spawn rate (e.g., 10 users/second)
3. Click "Start swarming"
4. Monitor real-time statistics and charts

#### Headless Mode (Automated)
```bash
# Using helper script (10 users, 60 seconds)
./run-device-tests.sh locust-run

# Direct Docker Compose with custom parameters
docker-compose --profile testing run --rm device_locust \
  locust -f locustfile.py \
  --host=http://device_service:8000 \
  --users=50 \
  --spawn-rate=5 \
  --run-time=120s \
  --headless \
  --html=locust_report.html
```

#### Locust Test Scenarios

The `locustfile.py` includes two user types:

1. **DeviceAPIUser** (Regular user)
   - List devices (weight: 5)
   - Get device by ID (weight: 3)
   - Create device (weight: 2)
   - Update device (weight: 2)
   - Delete device (weight: 1)

2. **AdminUser** (Admin operations)
   - List all devices with high limit
   - Health check

### 4. Pylint Code Quality

#### Run Pylint
```bash
# Using helper script
./run-device-tests.sh lint

# Direct Docker Compose
docker-compose --profile testing run --rm device_tests pylint app
```

#### Pylint Configuration

Configured in `.pylintrc`:
- Checks code quality, style, and potential errors
- Enforces PEP 8 standards
- Detects code smells and anti-patterns

## 📊 Test Artifacts

After running tests, artifacts are saved to:

| Artifact | Location | Description |
|----------|----------|-------------|
| HTML Coverage | `./device/htmlcov/index.html` | Interactive coverage report |
| XML Coverage | `./device/coverage.xml` | Coverage for CI/CD |
| Test Reports | `./device/test_reports/` | Pytest test results |
| Locust Report | `./device/locust_report.html` | Load test results |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Networks                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────────────────────┐    │
│  │   Device     │─────▶│   Device DB (PostgreSQL)     │    │
│  │   Tests      │      │   InfluxDB (Time-series)     │    │
│  │  Container   │      └──────────────────────────────┘    │
│  └──────────────┘                                            │
│        │                                                     │
│        │ Runs:                                               │
│        │ - pytest                                            │
│        │ - coverage.py                                       │
│        │ - pylint                                            │
│        │                                                     │
│        ▼                                                     │
│  ┌──────────────┐                                           │
│  │   Volume     │                                           │
│  │   Mounts     │                                           │
│  │  - htmlcov   │                                           │
│  │  - coverage.xml                                          │
│  │  - test_reports                                          │
│  └──────────────┘                                           │
│                                                               │
│  ┌──────────────┐      ┌──────────────────────────────┐    │
│  │   Locust     │─────▶│   Device Service             │    │
│  │  Container   │      │   (http://device:8000)       │    │
│  └──────────────┘      └──────────────────────────────┘    │
│        │                                                     │
│        │ Port 8089 → Web UI                                 │
│        │                                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration Files

### pytest.ini
```ini
[pytest]
testpaths = tests
addopts = 
    --verbose
    --strict-markers
    --cov=app
    --cov-report=html
    --cov-report=term-missing
    --cov-report=xml
    --cov-fail-under=70

markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
```

### .coveragerc
```ini
[run]
source = app
omit = 
    */tests/*
    */test_*
    */__pycache__/*

[report]
precision = 2
show_missing = True
skip_covered = False

[html]
directory = htmlcov

[xml]
output = coverage.xml
```

## 🐛 Troubleshooting

### Database Not Running
```bash
# Check if databases are running
docker ps | grep device_db

# Start databases manually
docker-compose up -d device_db influxdb

# Wait for databases to be ready
sleep 15
```

### Tests Failing Due to Database Connection
```bash
# Ensure DATABASE_URL is correct
docker-compose --profile testing run --rm device_tests env | grep DATABASE_URL

# Check database logs
docker-compose logs device_db
```

### Coverage Report Not Generated
```bash
# Ensure volume mounts are working
docker-compose --profile testing run --rm device_tests ls -la

# Check if htmlcov directory exists
ls -la ./device/htmlcov/
```

### Locust Can't Connect to Device Service
```bash
# Ensure device service is running
docker ps | grep device_service

# Start device service
docker-compose up -d device_service

# Check device service logs
docker-compose logs device_service
```

### Permission Issues (Linux/Mac)
```bash
# Make script executable
chmod +x run-device-tests.sh

# Fix permissions on test artifacts
chmod -R 777 device/htmlcov
chmod -R 777 device/coverage_reports
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Device Service Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start databases
        run: docker-compose up -d device_db influxdb
      
      - name: Wait for databases
        run: sleep 15
      
      - name: Run tests
        run: docker-compose --profile testing run --rm device_tests
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./device/coverage.xml
      
      - name: Upload HTML coverage
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: ./device/htmlcov/
```

### Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Start Databases') {
            steps {
                sh 'docker-compose up -d device_db influxdb'
                sh 'sleep 15'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'docker-compose --profile testing run --rm device_tests'
            }
        }
        
        stage('Publish Coverage') {
            steps {
                publishHTML([
                    reportDir: 'device/htmlcov',
                    reportFiles: 'index.html',
                    reportName: 'Coverage Report'
                ])
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'device/coverage.xml,device/htmlcov/**'
            junit 'device/test_reports/*.xml'
        }
    }
}
```

## 📈 Best Practices

### Writing Tests

1. **Use Markers**: Tag tests appropriately
   ```python
   @pytest.mark.unit
   def test_device_creation():
       pass
   
   @pytest.mark.integration
   def test_database_connection():
       pass
   ```

2. **Use Fixtures**: Share setup code
   ```python
   @pytest.fixture
   def test_device():
       return {"name": "Test Device", "type": "sensor"}
   ```

3. **Test Coverage**: Aim for >70% coverage
   - Focus on critical paths
   - Test edge cases
   - Test error handling

4. **Isolate Tests**: Each test should be independent
   - Use database transactions
   - Clean up after tests
   - Don't rely on test order

### Load Testing

1. **Start Small**: Begin with few users, increase gradually
2. **Monitor Resources**: Watch CPU, memory, database connections
3. **Realistic Scenarios**: Simulate actual user behavior
4. **Set Thresholds**: Define acceptable response times

## 📚 Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Coverage.py Documentation](https://coverage.readthedocs.io/)
- [Locust Documentation](https://docs.locust.io/)
- [Pylint Documentation](https://pylint.pycqa.org/)

## 🤝 Contributing

When adding new tests:
1. Place test files in `device/tests/`
2. Follow naming convention: `test_*.py`
3. Use appropriate markers (@pytest.mark.unit, @pytest.mark.integration)
4. Ensure tests pass in Docker environment
5. Maintain coverage above 70%

---

**Created**: December 2025  
**Version**: 1.0  
**Python Version**: 3.11  
**Testing Framework**: pytest 7.4+
