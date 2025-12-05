# Quick Reference: Running Cypress Tests in Docker

## 🚀 Quick Commands

### Windows (PowerShell)
```powershell
# Run all tests
.\run-cypress-tests.ps1

# Run with Chrome
.\run-cypress-tests.ps1 chrome

# Run specific test
.\run-cypress-tests.ps1 spec docker-environment.cy.ts

# Clean artifacts
.\run-cypress-tests.ps1 cleanup
```

### Linux/Mac (Bash)
```bash
# Run all tests
./run-cypress-tests.sh

# Run with Chrome
./run-cypress-tests.sh chrome

# Run specific test
./run-cypress-tests.sh spec docker-environment.cy.ts

# Clean artifacts
./run-cypress-tests.sh cleanup
```

## 📦 Direct Docker Compose Commands

```bash
# Run all tests
docker-compose --profile testing run --rm cypress_tests

# Run with specific browser
docker-compose --profile testing run --rm cypress_tests npx cypress run --browser chrome

# Run specific test file
docker-compose --profile testing run --rm cypress_tests npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run tests in headed mode (requires display)
docker-compose --profile testing run --rm cypress_tests npx cypress run --headed

# Build the Cypress image
docker-compose --profile testing build cypress_tests
```

## 🔍 Debugging

```bash
# View frontend logs
docker-compose logs -f frontend_service

# Check if frontend is running
docker ps | grep frontend_service

# Start frontend manually
docker-compose up -d frontend_service

# Inspect Cypress container
docker-compose --profile testing run --rm cypress_tests npx cypress info

# Run with debug output
docker-compose --profile testing run --rm -e DEBUG=cypress:* cypress_tests
```

## 📊 Test Results

- **Videos**: `./frontend/cypress/videos/`
- **Screenshots**: `./frontend/cypress/screenshots/`

## 🛠️ Troubleshooting

### Frontend not accessible
```bash
# Ensure frontend is running
docker-compose up -d frontend_service

# Wait 30 seconds for services to start
Start-Sleep -Seconds 30  # PowerShell
sleep 30                  # Bash
```

### Tests timing out
- Increase timeouts in `cypress.config.ts`
- Ensure all required services are running
- Check Docker network connectivity

### Permission issues (Linux/Mac)
```bash
chmod +x run-cypress-tests.sh
chmod -R 777 frontend/cypress/videos
chmod -R 777 frontend/cypress/screenshots
```

## 📝 Available Test Files

- `auth.cy.ts` - Authentication tests
- `navigation.cy.ts` - Navigation tests
- `admin.cy.ts` - Admin functionality tests
- `doctor.cy.ts` - Doctor workflow tests
- `patient.cy.ts` - Patient workflow tests
- `docker-environment.cy.ts` - Docker environment verification

## 🔄 CI/CD Integration

The tests can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Cypress Tests
  run: docker-compose --profile testing run --rm cypress_tests
```

For more details, see [CYPRESS_DOCKER.md](./CYPRESS_DOCKER.md)
