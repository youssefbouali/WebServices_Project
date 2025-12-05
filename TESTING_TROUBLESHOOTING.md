# Testing Troubleshooting Guide

Common issues and solutions when running tests in Docker.

## 🔴 Cypress Issues

### Issue 1: Cypress Verification Timeout

**Error:**
```
Cypress verification timed out.
Command timed out after 30000 milliseconds
```

**Cause:** Missing system dependencies or insufficient timeout on Linux systems.

**Solution:** The Dockerfile has been updated with:
1. Required system libraries (libgtk, libgbm, libnss3, etc.)
2. Increased verification timeout (100 seconds)
3. CI environment variable

**To apply the fix:**
```bash
# Rebuild the Cypress image
docker-compose --profile testing build cypress_tests

# Then run tests
docker-compose --profile testing run --rm cypress_tests
```

**Alternative workaround:**
```bash
# Run with increased timeout
docker-compose --profile testing run --rm \
  -e CYPRESS_VERIFY_TIMEOUT=100000 \
  cypress_tests
```

### Issue 2: Cypress Can't Connect to Frontend

**Error:**
```
Error: connect ECONNREFUSED
```

**Solution:**
```bash
# Ensure frontend is running
docker-compose up -d frontend_service

# Wait for it to be ready
sleep 30

# Check if it's accessible
docker-compose logs frontend_service

# Then run Cypress
docker-compose --profile testing run --rm cypress_tests
```

### Issue 3: Cypress Tests Fail with "baseUrl" Error

**Solution:**
Check that the baseUrl is correctly set:
```bash
# Verify environment variable
docker-compose --profile testing run --rm cypress_tests env | grep CYPRESS_baseUrl

# Should show: CYPRESS_baseUrl=http://frontend_service:8080
```

---

## 🔴 Device Tests Issues

### Issue 1: Import Error in Tests

**Error:**
```
ImportError while importing test module
ModuleNotFoundError: No module named 'device'
```

**Cause:** Tests were using `from device.app import ...` instead of `from app import ...`

**Solution:** Import paths have been fixed. If you see this error:

1. Check your test files use:
   ```python
   from app import models, crud, schemas  # ✓ Correct
   ```
   
   Not:
   ```python
   from device.app import models, crud, schemas  # ✗ Wrong
   ```

2. Verify PYTHONPATH is set in Dockerfile:
   ```dockerfile
   ENV PYTHONPATH=/app
   ```

### Issue 2: Database Connection Error

**Error:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
```bash
# Ensure databases are running
docker-compose up -d device_db influxdb

# Wait for them to be ready
sleep 15

# Check database logs
docker-compose logs device_db

# Then run tests
docker-compose --profile testing run --rm device_tests
```

### Issue 3: InfluxDB Connection Timeout

**Error:**
```
requests.exceptions.ConnectionError: HTTPConnectionPool
```

**Solution:**
The tests should stub InfluxDB calls. Verify `test_api.py` has:
```python
influx = importlib.import_module("app.influxdb_client")
influx.write_iot_data = lambda device_id, value: None
```

---

## 🔴 Locust Issues

### Issue 1: Locust Can't Connect to Device Service

**Error:**
```
Connection refused
```

**Solution:**
```bash
# Ensure device service is running
docker-compose up -d device_service

# Wait for it to be ready
sleep 10

# Check if accessible
docker-compose logs device_service

# Then run Locust
docker-compose --profile testing up device_locust
```

### Issue 2: Locust Web UI Not Accessible

**Problem:** Can't access http://localhost:8089

**Solution:**
```bash
# Check if port is mapped
docker-compose ps device_locust

# Should show: 0.0.0.0:8089->8089/tcp

# If not, check docker-compose.yml has:
ports:
  - "8089:8089"
```

---

## 🔴 Pylint Issues

### Issue 1: Pylint Import Errors

**Error:**
```
E0401: Unable to import 'fastapi'
```

**Solution:**
This is already disabled in `.pylintrc`. If you still see it:
```bash
# Verify .pylintrc is being used
docker-compose --profile testing run --rm device_pylint ls -la .pylintrc

# Check if disable is in config
docker-compose --profile testing run --rm device_pylint cat .pylintrc | grep E0401
```

### Issue 2: Pylint Score Too Low

**Solution:**
1. Run pylint to see specific issues:
   ```bash
   docker-compose --profile testing run --rm device_pylint
   ```

2. Fix issues incrementally:
   - Errors (E) first
   - Warnings (W) second
   - Refactoring (R) third
   - Conventions (C) last

3. Or adjust threshold in `.pylintrc`:
   ```ini
   [MASTER]
   fail-under=6.0  # Lower from 7.0
   ```

---

## 🔴 General Docker Issues

### Issue 1: "No such service" Error

**Error:**
```
ERROR: No such service: device_tests
```

**Solution:**
```bash
# Use the --profile flag
docker-compose --profile testing run --rm device_tests

# Not just:
docker-compose run device_tests  # ✗ Won't work
```

### Issue 2: Container Exits Immediately

**Solution:**
```bash
# Check container logs
docker-compose --profile testing logs cypress_tests

# Run with interactive mode to see errors
docker-compose --profile testing run --rm device_tests bash
```

### Issue 3: Permission Denied (Linux/Mac)

**Error:**
```
Permission denied: './run-device-tests.sh'
```

**Solution:**
```bash
# Make scripts executable
chmod +x run-device-tests.sh
chmod +x run-cypress-tests.sh

# Fix artifact directories
chmod -R 777 device/htmlcov
chmod -R 777 frontend/cypress/videos
chmod -R 777 frontend/cypress/screenshots
```

### Issue 4: Port Already in Use

**Error:**
```
Bind for 0.0.0.0:8089 failed: port is already allocated
```

**Solution:**
```bash
# Find what's using the port
lsof -i :8089  # Linux/Mac
netstat -ano | findstr :8089  # Windows

# Stop the conflicting service or change port in docker-compose.yml
```

### Issue 5: Out of Disk Space

**Error:**
```
no space left on device
```

**Solution:**
```bash
# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove old images
docker image prune -a
```

---

## 🔴 Network Issues

### Issue 1: Services Can't Communicate

**Solution:**
```bash
# Check if services are on same network
docker network inspect device-network

# Verify service names resolve
docker-compose --profile testing run --rm device_tests ping device_db

# Check docker-compose.yml networks configuration
```

### Issue 2: DNS Resolution Fails

**Solution:**
```bash
# Use service names, not localhost
# ✓ Correct: http://device_service:8000
# ✗ Wrong: http://localhost:8000

# In docker-compose.yml, ensure services are in same network
```

---

## 🔴 Build Issues

### Issue 1: Build Fails with "npm install" Error

**Solution:**
```bash
# Clear npm cache
docker-compose --profile testing build --no-cache cypress_tests

# Or use different registry in Dockerfile:
RUN npm config set registry https://registry.npmjs.org
```

### Issue 2: Build Fails with "pip install" Error

**Solution:**
```bash
# Clear pip cache
docker-compose --profile testing build --no-cache device_tests

# Or add to Dockerfile:
RUN pip install --no-cache-dir --upgrade pip
```

---

## 📋 Quick Diagnostic Commands

### Check All Services Status
```bash
docker-compose ps
```

### View Logs for Specific Service
```bash
docker-compose logs -f device_tests
docker-compose logs -f cypress_tests
docker-compose logs -f device_locust
```

### Rebuild All Testing Images
```bash
docker-compose --profile testing build --no-cache
```

### Clean Everything and Start Fresh
```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove all images
docker-compose --profile testing down --rmi all

# Rebuild
docker-compose --profile testing build

# Start fresh
docker-compose up -d
```

### Interactive Debugging
```bash
# Get shell in test container
docker-compose --profile testing run --rm device_tests bash

# Then inside container:
python -c "import app; print(app.__file__)"
pytest tests/ -v
pylint app/
```

---

## 🆘 Still Having Issues?

1. **Check the logs:**
   ```bash
   docker-compose logs [service_name]
   ```

2. **Verify environment variables:**
   ```bash
   docker-compose --profile testing run --rm device_tests env
   ```

3. **Check network connectivity:**
   ```bash
   docker-compose --profile testing run --rm device_tests ping device_db
   ```

4. **Rebuild from scratch:**
   ```bash
   docker-compose --profile testing build --no-cache
   ```

5. **Check Docker resources:**
   - Ensure Docker has enough memory (4GB+ recommended)
   - Ensure Docker has enough disk space (10GB+ free)

---

**Last Updated**: December 2025  
**Version**: 1.0
