# Cypress Docker Testing Setup - Summary

## ✅ What Was Created

This setup enables you to run Cypress end-to-end tests inside Docker containers for the HealthFront project.

### Files Created

1. **`frontend/Dockerfile.cypress`**
   - Specialized Dockerfile using the official `cypress/included:13.17.0` image
   - Pre-configured with all necessary dependencies
   - Includes Chrome, Firefox, and Electron browsers

2. **`docker-compose.yml` (updated)**
   - Added `cypress_tests` service
   - Configured with profile `testing` (won't start automatically)
   - Connected to all application networks
   - Volume mounts for test artifacts

3. **`run-cypress-tests.ps1`**
   - PowerShell script for Windows users
   - Easy-to-use commands for running tests
   - Automatic frontend service checking

4. **`run-cypress-tests.sh`**
   - Bash script for Linux/Mac users
   - Same functionality as PowerShell version
   - Includes color-coded output

5. **`frontend/cypress.config.ts` (updated)**
   - Modified to use environment variable for baseUrl
   - Works both locally and in Docker
   - Fallback to localhost for local development

6. **`frontend/cypress/e2e/docker-environment.cy.ts`**
   - Test file to verify Docker setup
   - Tests network connectivity
   - Validates configuration

7. **`CYPRESS_DOCKER.md`**
   - Comprehensive documentation
   - Architecture explanation
   - Troubleshooting guide
   - CI/CD integration examples

8. **`CYPRESS_QUICK_REFERENCE.md`**
   - Quick command reference
   - Common use cases
   - Debugging tips

9. **`frontend/.dockerignore` (updated)**
   - Excludes test artifacts from Docker builds
   - Reduces image size

## 🚀 How to Use

### Option 1: Using Helper Scripts (Recommended)

**Windows:**
```powershell
.\run-cypress-tests.ps1
```

**Linux/Mac:**
```bash
chmod +x run-cypress-tests.sh
./run-cypress-tests.sh
```

### Option 2: Direct Docker Compose

```bash
docker-compose --profile testing run --rm cypress_tests
```

## 📋 Available Commands

| Command | Windows | Linux/Mac |
|---------|---------|-----------|
| Run all tests | `.\run-cypress-tests.ps1` | `./run-cypress-tests.sh` |
| Run with Chrome | `.\run-cypress-tests.ps1 chrome` | `./run-cypress-tests.sh chrome` |
| Run specific test | `.\run-cypress-tests.ps1 spec auth.cy.ts` | `./run-cypress-tests.sh spec auth.cy.ts` |
| Clean artifacts | `.\run-cypress-tests.ps1 cleanup` | `./run-cypress-tests.sh cleanup` |
| Show help | `.\run-cypress-tests.ps1 help` | `./run-cypress-tests.sh help` |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Networks                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────────────────────┐    │
│  │   Cypress    │─────▶│   Frontend Service           │    │
│  │   Tests      │      │   (http://frontend:8080)     │    │
│  │  Container   │      └──────────────────────────────┘    │
│  └──────────────┘                                            │
│        │                                                     │
│        │                                                     │
│        ├─────────▶ Backend Services (API calls)             │
│        │          - Profile Service                          │
│        │          - Treatment Service                        │
│        │          - Device Service                           │
│        │          - Planning Service                         │
│        │                                                     │
│        ▼                                                     │
│  ┌──────────────┐                                           │
│  │   Volume     │                                           │
│  │   Mounts     │                                           │
│  │  - Videos    │                                           │
│  │  - Screenshots                                           │
│  └──────────────┘                                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 Key Features

### 1. **Profile-Based Activation**
The Cypress service uses Docker Compose profiles, so it won't start automatically with `docker-compose up`. This prevents unnecessary resource usage.

### 2. **Network Connectivity**
The Cypress container is connected to all application networks, allowing it to test the full stack including API calls.

### 3. **Artifact Persistence**
Test videos and screenshots are automatically saved to your local filesystem via volume mounts.

### 4. **Multi-Browser Support**
The setup includes Chrome, Firefox, and Electron browsers for comprehensive testing.

### 5. **Environment Flexibility**
The same Cypress configuration works both locally and in Docker, thanks to environment variable support.

## 📊 Test Artifacts

After running tests, you'll find:

- **Videos**: `./frontend/cypress/videos/`
  - Full video recordings of test execution
  - Useful for debugging failures

- **Screenshots**: `./frontend/cypress/screenshots/`
  - Automatic screenshots on test failures
  - Manual screenshots from tests

## 🧪 Existing Tests

The project already includes these test files:

1. **`auth.cy.ts`** - Authentication and login tests
2. **`navigation.cy.ts`** - Navigation and routing tests
3. **`admin.cy.ts`** - Admin functionality tests
4. **`doctor.cy.ts`** - Doctor workflow tests
5. **`patient.cy.ts`** - Patient workflow tests
6. **`docker-environment.cy.ts`** - Docker setup verification (NEW)

## 🔧 Configuration

### Environment Variables

The Cypress container uses these environment variables:

```yaml
CYPRESS_baseUrl: http://frontend_service:8080
CYPRESS_video: "true"
CYPRESS_screenshotOnRunFailure: "true"
```

### Cypress Config

Located in `frontend/cypress.config.ts`:

```typescript
baseUrl: process.env.CYPRESS_baseUrl || "http://localhost:5173"
video: true
screenshotOnRunFailure: true
defaultCommandTimeout: 10000
requestTimeout: 10000
responseTimeout: 10000
```

## 🐛 Troubleshooting

### Frontend Service Not Running

The helper scripts automatically check if the frontend is running and start it if needed. If you're using Docker Compose directly:

```bash
docker-compose up -d frontend_service
sleep 30  # Wait for services to be ready
```

### Tests Timing Out

Increase timeouts in `cypress.config.ts` or ensure all required services are running:

```bash
docker-compose ps
```

### Permission Issues (Linux/Mac)

```bash
chmod +x run-cypress-tests.sh
chmod -R 777 frontend/cypress/videos
chmod -R 777 frontend/cypress/screenshots
```

## 🔄 CI/CD Integration

### GitHub Actions

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
      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-artifacts
          path: |
            frontend/cypress/videos
            frontend/cypress/screenshots
```

### Jenkins

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
            archiveArtifacts artifacts: 'frontend/cypress/videos/**,frontend/cypress/screenshots/**'
        }
    }
}
```

## 📚 Documentation

- **Full Documentation**: [CYPRESS_DOCKER.md](./CYPRESS_DOCKER.md)
- **Quick Reference**: [CYPRESS_QUICK_REFERENCE.md](./CYPRESS_QUICK_REFERENCE.md)
- **Cypress Official Docs**: https://docs.cypress.io/

## 🎯 Next Steps

1. **Run the verification test**:
   ```powershell
   .\run-cypress-tests.ps1 spec docker-environment.cy.ts
   ```

2. **Run all existing tests**:
   ```powershell
   .\run-cypress-tests.ps1
   ```

3. **Check test artifacts**:
   - Navigate to `frontend/cypress/videos/`
   - Navigate to `frontend/cypress/screenshots/`

4. **Integrate into CI/CD**:
   - Add the GitHub Actions or Jenkins configuration
   - Configure artifact archiving

## ✨ Benefits

- ✅ **Consistent Environment**: Tests run in the same environment as production
- ✅ **No Local Dependencies**: No need to install Cypress locally
- ✅ **Full Stack Testing**: Can test frontend + backend integration
- ✅ **CI/CD Ready**: Easy to integrate into automated pipelines
- ✅ **Artifact Persistence**: Videos and screenshots saved automatically
- ✅ **Multi-Browser**: Test across Chrome, Firefox, and Electron
- ✅ **Network Isolation**: Tests run in isolated Docker networks

## 🤝 Contributing

When adding new tests:

1. Place test files in `frontend/cypress/e2e/`
2. Follow naming convention: `feature-name.cy.ts`
3. Add data-testid attributes to components for reliable selectors
4. Test locally before committing
5. Ensure tests pass in Docker environment

---

**Created**: December 2025  
**Version**: 1.0  
**Cypress Version**: 13.17.0  
**Docker Image**: cypress/included:13.17.0
