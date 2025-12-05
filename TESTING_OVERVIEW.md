# Testing Overview - HealthTrack Project

Complete testing infrastructure for the HealthTrack platform, covering frontend E2E tests and backend service tests.

## 📋 Table of Contents

1. [Frontend Testing (Cypress)](#frontend-testing-cypress)
2. [Device Service Testing (pytest, Coverage, Locust)](#device-service-testing)
3. [Quick Commands](#quick-commands)
4. [CI/CD Integration](#cicd-integration)

---

## 🌐 Frontend Testing (Cypress)

### Overview
End-to-end testing for the Next.js frontend using Cypress in Docker.

### Quick Start
```powershell
# Windows
.\run-cypress-tests.ps1

# Linux/Mac
./run-cypress-tests.sh
```

### Features
- ✅ E2E testing with Cypress 13.17.0
- ✅ Multiple browser support (Chrome, Firefox, Electron)
- ✅ Video recording of test execution
- ✅ Screenshot on failure
- ✅ Network connectivity testing

### Test Files
- `auth.cy.ts` - Authentication tests
- `navigation.cy.ts` - Navigation tests
- `admin.cy.ts` - Admin functionality
- `doctor.cy.ts` - Doctor workflows
- `patient.cy.ts` - Patient workflows
- `docker-environment.cy.ts` - Docker verification

### Artifacts
- **Videos**: `./frontend/cypress/videos/`
- **Screenshots**: `./frontend/cypress/screenshots/`

### Documentation
- [Cypress Setup Summary](./CYPRESS_SETUP_SUMMARY.md)
- [Cypress Documentation](./CYPRESS_DOCKER.md)
- [Quick Reference](./CYPRESS_QUICK_REFERENCE.md)

---

## 🔧 Device Service Testing

### Overview
Comprehensive testing for the Python FastAPI device service including unit tests, integration tests, coverage analysis, and load testing.

### Quick Start
```powershell
# Windows
.\run-device-tests.ps1

# Linux/Mac
./run-device-tests.sh
```

### Features
- ✅ Unit & integration tests with pytest
- ✅ Code coverage with Coverage.py (70% minimum)
- ✅ Load testing with Locust
- ✅ Code quality checks with pylint
- ✅ Real database testing (PostgreSQL, InfluxDB)

### Test Files
- `test_api.py` - API endpoint tests
- `test_crud.py` - CRUD operation tests

### Artifacts
- **HTML Coverage**: `./device/htmlcov/index.html`
- **XML Coverage**: `./device/coverage.xml`
- **Test Reports**: `./device/test_reports/`
- **Locust Report**: `./device/locust_report.html`

### Documentation
- [Device Testing Summary](./DEVICE_TESTING_SUMMARY.md)
- [Device Testing Guide](./DEVICE_TESTING.md)
- [Quick Reference](./DEVICE_TESTING_QUICK_REF.md)

---

## 🚀 Quick Commands

### Frontend (Cypress)

| Task | Windows | Linux/Mac |
|------|---------|-----------|
| Run all tests | `.\run-cypress-tests.ps1` | `./run-cypress-tests.sh` |
| Run with Chrome | `.\run-cypress-tests.ps1 chrome` | `./run-cypress-tests.sh chrome` |
| Run specific test | `.\run-cypress-tests.ps1 spec auth.cy.ts` | `./run-cypress-tests.sh spec auth.cy.ts` |
| Clean artifacts | `.\run-cypress-tests.ps1 cleanup` | `./run-cypress-tests.sh cleanup` |

### Device Service

| Task | Windows | Linux/Mac |
|------|---------|-----------|
| Run all tests | `.\run-device-tests.ps1` | `./run-device-tests.sh` |
| Run specific test | `.\run-device-tests.ps1 test-file test_api.py` | `./run-device-tests.sh test-file test_api.py` |
| Run unit tests | `.\run-device-tests.ps1 test-unit` | `./run-device-tests.sh test-unit` |
| Start Locust UI | `.\run-device-tests.ps1 locust` | `./run-device-tests.sh locust` |
| Run load test | `.\run-device-tests.ps1 locust-run` | `./run-device-tests.sh locust-run` |
| Code quality | `.\run-device-tests.ps1 lint` | `./run-device-tests.sh lint` |
| Clean artifacts | `.\run-device-tests.ps1 cleanup` | `./run-device-tests.sh cleanup` |

### Direct Docker Compose

```bash
# Frontend Cypress Tests
docker-compose --profile testing run --rm cypress_tests

# Device pytest Tests
docker-compose --profile testing run --rm device_tests

# Device Locust Load Testing
docker-compose --profile testing up device_locust
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Testing Infrastructure                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐        ┌──────────────────────────┐   │
│  │  Cypress E2E Tests  │───────▶│  Frontend Service        │   │
│  │  (cypress_tests)    │        │  (Next.js on port 8080)  │   │
│  └─────────────────────┘        └──────────────────────────┘   │
│           │                                                      │
│           ├─ Videos                                              │
│           └─ Screenshots                                         │
│                                                                   │
│  ┌─────────────────────┐        ┌──────────────────────────┐   │
│  │  Device Tests       │───────▶│  Device DB (PostgreSQL)  │   │
│  │  (device_tests)     │        │  InfluxDB (Time-series)  │   │
│  │                     │        └──────────────────────────┘   │
│  │  - pytest           │                                        │
│  │  - coverage.py      │                                        │
│  │  - pylint           │                                        │
│  └─────────────────────┘                                        │
│           │                                                      │
│           ├─ htmlcov/                                            │
│           ├─ coverage.xml                                        │
│           └─ test_reports/                                       │
│                                                                   │
│  ┌─────────────────────┐        ┌──────────────────────────┐   │
│  │  Locust Load Tests  │───────▶│  Device Service          │   │
│  │  (device_locust)    │        │  (FastAPI on port 8000)  │   │
│  │  Port 8089 (Web UI) │        └──────────────────────────┘   │
│  └─────────────────────┘                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Full Test Suite

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start Frontend
        run: docker-compose up -d frontend_service
      
      - name: Wait for Frontend
        run: sleep 30
      
      - name: Run Cypress Tests
        run: docker-compose --profile testing run --rm cypress_tests
      
      - name: Upload Cypress Artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-artifacts
          path: |
            frontend/cypress/videos
            frontend/cypress/screenshots

  device-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start Databases
        run: docker-compose up -d device_db influxdb
      
      - name: Wait for Databases
        run: sleep 15
      
      - name: Run Device Tests
        run: docker-compose --profile testing run --rm device_tests
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./device/coverage.xml
      
      - name: Upload Coverage HTML
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
        stage('Frontend Tests') {
            steps {
                sh 'docker-compose up -d frontend_service'
                sh 'sleep 30'
                sh 'docker-compose --profile testing run --rm cypress_tests'
            }
        }
        
        stage('Device Tests') {
            steps {
                sh 'docker-compose up -d device_db influxdb'
                sh 'sleep 15'
                sh 'docker-compose --profile testing run --rm device_tests'
            }
        }
        
        stage('Load Tests') {
            steps {
                sh 'docker-compose up -d device_service'
                sh 'sleep 10'
                sh '''
                    docker-compose --profile testing run --rm device_locust \
                    locust -f locustfile.py \
                    --host=http://device_service:8000 \
                    --users=50 \
                    --spawn-rate=5 \
                    --run-time=60s \
                    --headless \
                    --html=locust_report.html
                '''
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: '''
                frontend/cypress/videos/**,
                frontend/cypress/screenshots/**,
                device/htmlcov/**,
                device/coverage.xml,
                device/locust_report.html
            '''
            
            publishHTML([
                reportDir: 'device/htmlcov',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

---

## 📊 Test Artifacts Summary

| Service | Artifact Type | Location |
|---------|---------------|----------|
| **Frontend** | Cypress Videos | `./frontend/cypress/videos/` |
| **Frontend** | Cypress Screenshots | `./frontend/cypress/screenshots/` |
| **Device** | HTML Coverage | `./device/htmlcov/index.html` |
| **Device** | XML Coverage | `./device/coverage.xml` |
| **Device** | Test Reports | `./device/test_reports/` |
| **Device** | Locust Report | `./device/locust_report.html` |

---

## 🐛 Troubleshooting

### Frontend Tests

```bash
# Ensure frontend is running
docker ps | grep frontend_service

# Start frontend manually
docker-compose up -d frontend_service
sleep 30

# View logs
docker-compose logs frontend_service
```

### Device Tests

```bash
# Ensure databases are running
docker ps | grep device_db

# Start databases manually
docker-compose up -d device_db influxdb
sleep 15

# View logs
docker-compose logs device_db
docker-compose logs influxdb
```

### Clean Everything

```bash
# Clean frontend artifacts
./run-cypress-tests.sh cleanup  # or .ps1 on Windows

# Clean device artifacts
./run-device-tests.sh cleanup  # or .ps1 on Windows

# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## 📈 Coverage & Quality Metrics

### Device Service
- **Minimum Coverage**: 70%
- **Code Quality**: Pylint checks
- **Load Testing**: Locust scenarios

### Frontend
- **E2E Coverage**: All critical user flows
- **Browser Support**: Chrome, Firefox, Electron
- **Visual Testing**: Screenshots on failure

---

## 🎯 Best Practices

### Writing Tests

1. **Frontend (Cypress)**
   - Use `data-testid` attributes
   - Wait for API calls with `cy.intercept()`
   - Keep tests independent
   - Use fixtures for test data

2. **Backend (pytest)**
   - Use markers (`@pytest.mark.unit`, `@pytest.mark.integration`)
   - Write isolated tests
   - Use fixtures for setup
   - Aim for >70% coverage

### Running Tests

1. **Locally**: Use helper scripts for convenience
2. **CI/CD**: Use direct Docker Compose commands
3. **Before Commit**: Run relevant tests
4. **Before Deploy**: Run full test suite

---

## 📚 Complete Documentation

### Frontend Testing
- [Cypress Setup Summary](./CYPRESS_SETUP_SUMMARY.md)
- [Cypress Docker Guide](./CYPRESS_DOCKER.md)
- [Cypress Quick Reference](./CYPRESS_QUICK_REFERENCE.md)

### Device Testing
- [Device Testing Summary](./DEVICE_TESTING_SUMMARY.md)
- [Device Testing Guide](./DEVICE_TESTING.md)
- [Device Quick Reference](./DEVICE_TESTING_QUICK_REF.md)

---

## ✨ Key Benefits

- ✅ **Consistent Environment**: All tests run in Docker
- ✅ **No Local Setup**: No need to install dependencies locally
- ✅ **CI/CD Ready**: Easy integration with pipelines
- ✅ **Comprehensive Coverage**: Frontend E2E + Backend unit/integration + Load testing
- ✅ **Artifact Persistence**: All reports saved locally
- ✅ **Interactive Testing**: Cypress UI + Locust Web UI
- ✅ **Code Quality**: Automated linting and coverage checks

---

**Created**: December 2025  
**Version**: 1.0  
**Project**: HealthTrack Medical Platform
