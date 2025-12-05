# Cypress E2E Testing with Docker

This document explains how to run Cypress end-to-end tests inside Docker containers for the HealthFront project.

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
# Run all tests
.\run-cypress-tests.ps1

# Run with specific browser
.\run-cypress-tests.ps1 chrome

# Run specific test file
.\run-cypress-tests.ps1 spec login.cy.ts

# Clean up test artifacts
.\run-cypress-tests.ps1 cleanup
```

### Linux/Mac (Bash)
```bash
# Make script executable (first time only)
chmod +x run-cypress-tests.sh

# Run all tests
./run-cypress-tests.sh

# Run with specific browser
./run-cypress-tests.sh chrome

# Run specific test file
./run-cypress-tests.sh spec login.cy.ts

# Clean up test artifacts
./run-cypress-tests.sh cleanup
```

## 📋 Manual Docker Commands

If you prefer to use Docker Compose directly:

### Run All Tests
```bash
# Start frontend service first
docker-compose up -d frontend_service

# Run Cypress tests
docker-compose --profile testing run --rm cypress_tests
```

### Run with Specific Browser
```bash
# Chrome
docker-compose --profile testing run --rm cypress_tests npx cypress run --browser chrome

# Firefox
docker-compose --profile testing run --rm cypress_tests npx cypress run --browser firefox

# Electron (default)
docker-compose --profile testing run --rm cypress_tests npx cypress run --browser electron
```

### Run Specific Test File
```bash
docker-compose --profile testing run --rm cypress_tests npx cypress run --spec "cypress/e2e/your-test.cy.ts"
```

### Run Tests with Custom Configuration
```bash
# Run tests in headed mode (requires X11 forwarding on Linux)
docker-compose --profile testing run --rm cypress_tests npx cypress run --headed

# Run tests with specific viewport
docker-compose --profile testing run --rm cypress_tests npx cypress run --config viewportWidth=1920,viewportHeight=1080

# Run tests and record video
docker-compose --profile testing run --rm -e CYPRESS_video=true cypress_tests
```

## 🏗️ Architecture

### Docker Setup

The Cypress testing setup consists of:

1. **Dockerfile.cypress**: Specialized Dockerfile using the official `cypress/included` image
2. **cypress_tests service**: Docker Compose service configured with:
   - Access to all application networks
   - Volume mounts for test artifacts (videos, screenshots)
   - Environment variables for configuration
   - Profile-based activation (doesn't start with regular services)

### Network Configuration

The Cypress container is connected to all application networks:
- `frontend-network`: Access to frontend service
- `suivitraitement-network`: Access to treatment tracking service
- `profile-network`: Access to profile service
- `device-network`: Access to IoT device service
- `planification-network`: Access to appointment planning service

This allows Cypress to test the full application stack, including API calls.

### Volume Mounts

Test artifacts are automatically saved to your local filesystem:
- **Videos**: `./frontend/cypress/videos/`
- **Screenshots**: `./frontend/cypress/screenshots/`
- **Test specs**: `./frontend/cypress/` (mounted for live editing)

## 🔧 Configuration

### Environment Variables

The following environment variables are configured in `docker-compose.yml`:

```yaml
CYPRESS_baseUrl: http://frontend_service:8080
CYPRESS_video: "true"
CYPRESS_screenshotOnRunFailure: "true"
```

You can override these when running tests:

```bash
docker-compose --profile testing run --rm \
  -e CYPRESS_baseUrl=http://frontend_service:8080 \
  -e CYPRESS_video=false \
  cypress_tests
```

### Cypress Configuration

The `cypress.config.ts` file is configured to:
- Use environment variable for baseUrl (Docker-friendly)
- Fallback to `http://localhost:5173` for local development
- Enable video recording
- Enable screenshot on failure
- Set reasonable timeouts

## 📝 Writing Tests

### Test Location
Place your test files in: `frontend/cypress/e2e/`

### Example Test
```typescript
// frontend/cypress/e2e/example.cy.ts
describe('Example Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.contains('Welcome').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/login');
  });
});
```

### Best Practices for Docker Testing

1. **Use data-testid attributes**: More reliable than CSS selectors
   ```typescript
   cy.get('[data-testid="submit-button"]').click();
   ```

2. **Wait for API calls**: Use `cy.intercept()` to wait for network requests
   ```typescript
   cy.intercept('GET', '/api/profiles').as('getProfiles');
   cy.visit('/profiles');
   cy.wait('@getProfiles');
   ```

3. **Set appropriate timeouts**: Docker containers may be slower
   ```typescript
   cy.get('[data-testid="slow-element"]', { timeout: 10000 }).should('be.visible');
   ```

4. **Use fixtures**: Store test data in `cypress/fixtures/`
   ```typescript
   cy.fixture('user.json').then((user) => {
     cy.get('[data-testid="email"]').type(user.email);
   });
   ```

## 🐛 Troubleshooting

### Frontend Service Not Running
```bash
# Check if frontend is running
docker ps | grep frontend_service

# Start frontend manually
docker-compose up -d frontend_service

# Wait for it to be ready (check logs)
docker-compose logs -f frontend_service
```

### Tests Failing Due to Timeouts
Increase timeouts in `cypress.config.ts`:
```typescript
defaultCommandTimeout: 15000,
requestTimeout: 15000,
responseTimeout: 15000,
```

### Cannot Connect to Frontend
Ensure the Cypress container is on the correct network:
```bash
# Inspect the network
docker network inspect frontend-network

# Verify both containers are connected
docker inspect cypress_tests | grep Networks
docker inspect frontend_service | grep Networks
```

### Video/Screenshot Not Saving
Check volume mount permissions:
```bash
# Create directories if they don't exist
mkdir -p frontend/cypress/videos
mkdir -p frontend/cypress/screenshots

# On Linux/Mac, ensure proper permissions
chmod -R 777 frontend/cypress/videos
chmod -R 777 frontend/cypress/screenshots
```

### Browser Not Found
The `cypress/included` image comes with Chrome, Firefox, and Electron. If a specific browser fails:
```bash
# List available browsers in container
docker-compose --profile testing run --rm cypress_tests npx cypress info
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Start services
        run: docker-compose up -d frontend_service
      
      - name: Wait for frontend
        run: sleep 30
      
      - name: Run Cypress tests
        run: docker-compose --profile testing run --rm cypress_tests
      
      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-artifacts
          path: |
            frontend/cypress/videos
            frontend/cypress/screenshots
```

### Jenkins Example
```groovy
pipeline {
    agent any
    
    stages {
        stage('Start Services') {
            steps {
                sh 'docker-compose up -d frontend_service'
                sh 'sleep 30'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'docker-compose --profile testing run --rm cypress_tests'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'frontend/cypress/videos/**,frontend/cypress/screenshots/**', allowEmptyArchive: true
        }
    }
}
```

## 📊 Test Reports

### Viewing Results
- **Videos**: Check `frontend/cypress/videos/` for test execution recordings
- **Screenshots**: Check `frontend/cypress/screenshots/` for failure screenshots
- **Console output**: View in terminal during test execution

### Generating HTML Reports
Install Mochawesome reporter:
```bash
cd frontend
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

Update `cypress.config.ts`:
```typescript
reporter: 'mochawesome',
reporterOptions: {
  reportDir: 'cypress/reports',
  overwrite: false,
  html: true,
  json: true
}
```

## 🎯 Advanced Usage

### Parallel Testing
Run tests in parallel using multiple containers:
```bash
docker-compose --profile testing run --rm cypress_tests npx cypress run --parallel --record --key YOUR_KEY
```

### Custom Test Tags
Run tests with specific tags:
```bash
docker-compose --profile testing run --rm cypress_tests npx cypress run --env grepTags=@smoke
```

### Debug Mode
Run tests with debug output:
```bash
docker-compose --profile testing run --rm -e DEBUG=cypress:* cypress_tests
```

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Docker Images](https://github.com/cypress-io/cypress-docker-images)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

When adding new tests:
1. Place test files in `frontend/cypress/e2e/`
2. Follow naming convention: `feature-name.cy.ts`
3. Add appropriate data-testid attributes to components
4. Test locally before committing
5. Ensure tests pass in Docker environment

## 📄 License

This testing setup is part of the HealthFront project.
