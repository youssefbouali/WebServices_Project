# Device Service Testing Setup - Summary

## ✅ What Was Created

This setup enables you to run **pytest**, **Coverage.py**, and **Locust** load tests for the Device Service inside Docker containers.

### Files Created

1. **`device/Dockerfile.test`**
   - Specialized Dockerfile for running pytest and coverage
   - Includes all development dependencies
   - Pre-configured with pytest, coverage.py, and pylint

2. **`device/Dockerfile.locust`**
   - Specialized Dockerfile for Locust load testing
   - Lightweight image with only Locust dependencies
   - Exposes port 8089 for web UI

3. **`docker-compose.yml` (updated)**
   - Added `device_tests` service for pytest/coverage
   - Added `device_locust` service for load testing
   - Both use profile `testing` (won't start automatically)
   - Volume mounts for test artifacts

4. **`run-device-tests.ps1`**
   - PowerShell script for Windows users
   - Commands for pytest, coverage, Locust, and pylint
   - Automatic database service checking

5. **`run-device-tests.sh`**
   - Bash script for Linux/Mac users
   - Same functionality as PowerShell version
   - Color-coded output

6. **`DEVICE_TESTING.md`**
   - Comprehensive testing documentation
   - Detailed usage instructions
   - Architecture diagrams
   - CI/CD integration examples

7. **`DEVICE_TESTING_QUICK_REF.md`**
   - Quick reference guide
   - Common commands
   - Debugging tips

## 🚀 How to Use

### Option 1: Using Helper Scripts (Recommended)

**Windows:**
```powershell
.\run-device-tests.ps1
```

**Linux/Mac:**
```bash
chmod +x run-device-tests.sh
./run-device-tests.sh
```

### Option 2: Direct Docker Compose

```bash
# Pytest with coverage
docker-compose --profile testing run --rm device_tests

# Locust load testing
docker-compose --profile testing up device_locust
```

## 📋 Available Commands

| Command | Windows | Linux/Mac |
|---------|---------|-----------|
| Run all tests | `.\run-device-tests.ps1` | `./run-device-tests.sh` |
| Run specific test | `.\run-device-tests.ps1 test-file test_api.py` | `./run-device-tests.sh test-file test_api.py` |
| Run unit tests | `.\run-device-tests.ps1 test-unit` | `./run-device-tests.sh test-unit` |
| Run integration tests | `.\run-device-tests.ps1 test-integration` | `./run-device-tests.sh test-integration` |
| Start Locust UI | `.\run-device-tests.ps1 locust` | `./run-device-tests.sh locust` |
| Run load test | `.\run-device-tests.ps1 locust-run` | `./run-device-tests.sh locust-run` |
| Code quality | `.\run-device-tests.ps1 lint` | `./run-device-tests.sh lint` |
| Clean artifacts | `.\run-device-tests.ps1 cleanup` | `./run-device-tests.sh cleanup` |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Device Testing Stack                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────┐    │
│  │  device_tests    │─────▶│  Device DB (PostgreSQL)  │    │
│  │  Container       │      │  InfluxDB (Time-series)  │    │
│  │                  │      └──────────────────────────┘    │
│  │  - pytest        │                                       │
│  │  - coverage.py   │                                       │
│  │  - pylint        │                                       │
│  └──────────────────┘                                       │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────┐                                       │
│  │  Test Artifacts  │                                       │
│  │  - htmlcov/      │                                       │
│  │  - coverage.xml  │                                       │
│  │  - test_reports/ │                                       │
│  └──────────────────┘                                       │
│                                                               │
│  ┌──────────────────┐      ┌──────────────────────────┐    │
│  │  device_locust   │─────▶│  Device Service          │    │
│  │  Container       │      │  (http://device:8000)    │    │
│  │                  │      └──────────────────────────┘    │
│  │  Port 8089       │                                       │
│  │  (Web UI)        │                                       │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Testing Tools

### 1. Pytest with Coverage.py

**Features:**
- ✅ Automated unit and integration tests
- ✅ Code coverage measurement (minimum 70%)
- ✅ HTML, XML, and terminal coverage reports
- ✅ Test markers for organizing tests
- ✅ Parallel test execution support

**Test Files:**
- `device/tests/test_api.py` - API endpoint tests
- `device/tests/test_crud.py` - CRUD operation tests

**Configuration:**
- `pytest.ini` - Pytest configuration
- `.coveragerc` - Coverage configuration

### 2. Locust Load Testing

**Features:**
- ✅ Web UI for interactive load testing (port 8089)
- ✅ Headless mode for automated testing
- ✅ Real-time statistics and charts
- ✅ Distributed load testing support
- ✅ Custom user scenarios

**Test Scenarios:**
- `DeviceAPIUser` - Regular CRUD operations
- `AdminUser` - Admin bulk operations

**Configuration:**
- `locustfile.py` - Load test scenarios

### 3. Pylint Code Quality

**Features:**
- ✅ PEP 8 compliance checking
- ✅ Code smell detection
- ✅ Potential bug identification
- ✅ Code complexity analysis

**Configuration:**
- `.pylintrc` - Pylint rules and settings

## 📊 Test Artifacts

After running tests, artifacts are saved to:

| Artifact | Location | Description |
|----------|----------|-------------|
| **HTML Coverage** | `./device/htmlcov/index.html` | Interactive coverage report |
| **XML Coverage** | `./device/coverage.xml` | For CI/CD integration |
| **Test Reports** | `./device/test_reports/` | Pytest test results |
| **Locust Report** | `./device/locust_report.html` | Load test results (headless mode) |

## 🔑 Key Features

### 1. **Profile-Based Activation**
Testing services use Docker Compose profiles, so they won't start automatically with `docker-compose up`.

### 2. **Database Integration**
Tests run against real PostgreSQL and InfluxDB instances, ensuring accurate integration testing.

### 3. **Artifact Persistence**
All test results are saved to your local filesystem via volume mounts.

### 4. **Live Code Editing**
Source code is mounted, allowing you to edit tests and code without rebuilding containers.

### 5. **CI/CD Ready**
Easy integration with GitHub Actions, Jenkins, GitLab CI, etc.

## 📈 Coverage Requirements

- **Minimum Coverage**: 70%
- **Source Directory**: `app/`
- **Omitted**: tests, migrations, cache, virtual environments
- **Reports**: HTML, XML, Terminal

## 🌐 Locust Load Testing

### Web UI Mode
1. Start Locust: `./run-device-tests.sh locust`
2. Open browser: http://localhost:8089
3. Configure test parameters
4. Monitor real-time statistics

### Headless Mode
```bash
./run-device-tests.sh locust-run
```
- 10 users
- Spawn rate: 2 users/second
- Duration: 60 seconds
- Generates HTML report

## 🐛 Troubleshooting

### Database Not Running
```bash
docker-compose up -d device_db influxdb
sleep 15
```

### Tests Failing
```bash
# Check database logs
docker-compose logs device_db

# Verify environment variables
docker-compose --profile testing run --rm device_tests env | grep DATABASE_URL
```

### Permission Issues (Linux/Mac)
```bash
chmod +x run-device-tests.sh
chmod -R 777 device/htmlcov
```

### Clean Everything
```bash
./run-device-tests.sh cleanup
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Device Tests
  run: |
    docker-compose up -d device_db influxdb
    sleep 15
    docker-compose --profile testing run --rm device_tests
```

### Jenkins
```groovy
stage('Test') {
    steps {
        sh 'docker-compose up -d device_db influxdb'
        sh 'sleep 15'
        sh 'docker-compose --profile testing run --rm device_tests'
    }
}
```

## 📚 Documentation

- **[Complete Guide](./DEVICE_TESTING.md)** - Detailed documentation
- **[Quick Reference](./DEVICE_TESTING_QUICK_REF.md)** - Common commands

## 🎯 Next Steps

1. **Run the tests**:
   ```bash
   ./run-device-tests.sh test
   ```

2. **View coverage report**:
   - Open `device/htmlcov/index.html` in browser

3. **Try load testing**:
   ```bash
   ./run-device-tests.sh locust
   ```
   - Open http://localhost:8089

4. **Check code quality**:
   ```bash
   ./run-device-tests.sh lint
   ```

5. **Integrate into CI/CD**:
   - Add to GitHub Actions or Jenkins pipeline

## ✨ Benefits

- ✅ **Isolated Environment**: Tests run in containers, no local setup needed
- ✅ **Consistent Results**: Same environment for all developers
- ✅ **Real Database Testing**: Tests against actual PostgreSQL and InfluxDB
- ✅ **Comprehensive Coverage**: pytest, coverage, load testing, and linting
- ✅ **CI/CD Ready**: Easy integration with pipelines
- ✅ **Artifact Persistence**: All reports saved locally
- ✅ **Interactive Load Testing**: Web UI for Locust
- ✅ **Code Quality**: Automated pylint checks

## 🤝 Contributing

When adding new tests:
1. Place test files in `device/tests/`
2. Follow naming convention: `test_*.py`
3. Use markers: `@pytest.mark.unit`, `@pytest.mark.integration`
4. Maintain coverage above 70%
5. Test in Docker before committing

---

**Created**: December 2025  
**Version**: 1.0  
**Python Version**: 3.11  
**Testing Stack**: pytest 7.4+ | coverage 7.3+ | Locust 2.15+ | pylint 3.0+
