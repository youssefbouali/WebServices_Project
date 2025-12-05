# Device Testing Quick Reference

## 🚀 Quick Commands

### Windows (PowerShell)
```powershell
# Run all tests
.\run-device-tests.ps1

# Run specific test
.\run-device-tests.ps1 test-file test_api.py

# Run unit tests
.\run-device-tests.ps1 test-unit

# Start Locust UI
.\run-device-tests.ps1 locust

# Run load test
.\run-device-tests.ps1 locust-run

# Code quality
.\run-device-tests.ps1 lint

# Clean up
.\run-device-tests.ps1 cleanup
```

### Linux/Mac (Bash)
```bash
# Run all tests
./run-device-tests.sh

# Run specific test
./run-device-tests.sh test-file test_api.py

# Run unit tests
./run-device-tests.sh test-unit

# Start Locust UI
./run-device-tests.sh locust

# Run load test
./run-device-tests.sh locust-run

# Code quality
./run-device-tests.sh lint

# Clean up
./run-device-tests.sh cleanup
```

## 📦 Direct Docker Compose Commands

### Pytest & Coverage
```bash
# Run all tests
docker-compose --profile testing run --rm device_tests

# Run specific test file
docker-compose --profile testing run --rm device_tests pytest tests/test_api.py -v

# Run with markers
docker-compose --profile testing run --rm device_tests pytest -m unit -v
docker-compose --profile testing run --rm device_tests pytest -m integration -v

# Generate coverage report
docker-compose --profile testing run --rm device_tests coverage report

# Run with specific options
docker-compose --profile testing run --rm device_tests pytest -x  # Stop on first failure
docker-compose --profile testing run --rm device_tests pytest --lf  # Run last failed
```

### Locust Load Testing
```bash
# Start web UI (http://localhost:8089)
docker-compose --profile testing up device_locust

# Run headless mode
docker-compose --profile testing run --rm device_locust \
  locust -f locustfile.py \
  --host=http://device_service:8000 \
  --users=50 \
  --spawn-rate=5 \
  --run-time=120s \
  --headless \
  --html=locust_report.html
```

### Pylint
```bash
# Run code quality checks
docker-compose --profile testing run --rm device_tests pylint app
```

## 📊 Test Artifacts

| Artifact | Location |
|----------|----------|
| HTML Coverage | `./device/htmlcov/index.html` |
| XML Coverage | `./device/coverage.xml` |
| Test Reports | `./device/test_reports/` |
| Locust Report | `./device/locust_report.html` |

## 🔍 Debugging

```bash
# View database logs
docker-compose logs device_db

# Check if databases are running
docker ps | grep device_db

# Start databases manually
docker-compose up -d device_db influxdb

# Check environment variables
docker-compose --profile testing run --rm device_tests env | grep DATABASE_URL

# Interactive shell in test container
docker-compose --profile testing run --rm device_tests bash
```

## 🧪 Test Markers

```python
@pytest.mark.unit          # Unit tests
@pytest.mark.integration   # Integration tests
@pytest.mark.slow          # Slow running tests
```

Run specific markers:
```bash
pytest -m unit              # Run only unit tests
pytest -m integration       # Run only integration tests
pytest -m "not slow"        # Skip slow tests
```

## 📈 Coverage Requirements

- **Minimum Coverage**: 70%
- **Source**: `app/` directory
- **Omitted**: tests, migrations, cache

## 🌐 Locust Web UI

1. Start Locust: `./run-device-tests.sh locust`
2. Open browser: http://localhost:8089
3. Set parameters:
   - Number of users: 100
   - Spawn rate: 10
4. Click "Start swarming"
5. Monitor real-time stats

## 🔄 CI/CD Integration

### Build test image
```bash
docker-compose --profile testing build device_tests
```

### Run in CI pipeline
```bash
docker-compose up -d device_db influxdb
sleep 15
docker-compose --profile testing run --rm device_tests
```

## 🛠️ Troubleshooting

### Database not accessible
```bash
docker-compose up -d device_db influxdb
sleep 15
```

### Permission issues (Linux/Mac)
```bash
chmod +x run-device-tests.sh
chmod -R 777 device/htmlcov
```

### Clean everything
```bash
./run-device-tests.sh cleanup
docker-compose down -v
```

## 📚 Documentation

For detailed information, see:
- **[Device Testing Guide](./DEVICE_TESTING.md)** - Complete documentation

---

**Quick Help**: `./run-device-tests.sh help`
