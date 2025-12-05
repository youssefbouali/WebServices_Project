# Pylint Code Quality Checks - Docker Setup

## Overview

Pylint is configured to run inside Docker containers for the Device Service, providing consistent code quality checks across all environments.

## 🚀 Quick Start

### Option 1: Using Helper Scripts (Recommended)

**Windows:**
```powershell
# Run pylint (integrated with test container)
.\run-device-tests.ps1 lint

# Run pylint (dedicated container - faster)
.\run-device-tests.ps1 lint-only
```

**Linux/Mac:**
```bash
# Run pylint (integrated with test container)
./run-device-tests.sh lint

# Run pylint (dedicated container - faster)
./run-device-tests.sh lint-only
```

### Option 2: Direct Docker Compose

```bash
# Using test container (includes all test dependencies)
docker-compose --profile testing run --rm device_tests pylint app

# Using dedicated pylint container (lighter, faster)
docker-compose --profile testing run --rm device_pylint
```

## 📋 Available Methods

### Method 1: Integrated with Test Container
- **Command**: `device_tests pylint app`
- **Pros**: All dependencies available, can run tests and linting together
- **Cons**: Heavier container with all test dependencies
- **Use when**: Running full test suite including linting

### Method 2: Dedicated Pylint Container
- **Command**: `device_pylint`
- **Pros**: Lighter container, faster startup, focused on linting only
- **Cons**: Separate build required
- **Use when**: Only need code quality checks, CI/CD pipelines

## ⚙️ Configuration

### .pylintrc

The pylint configuration is located at `device/.pylintrc`:

```ini
[MASTER]
fail-under=7.0  # Minimum score required
ignore=CVS,migrations,venv,env,.venv,htmlcov,__pycache__
jobs=1

[MESSAGES CONTROL]
# Disabled checks for FastAPI projects
disable=
    C0111,  # missing-docstring
    C0103,  # invalid-name
    R0903,  # too-few-public-methods
    R0913,  # too-many-arguments
    W0212,  # protected-access
    C0114,  # missing-module-docstring
    C0115,  # missing-class-docstring
    C0116,  # missing-function-docstring
    R0801,  # duplicate-code
    W0511,  # fixme/todo comments
    E0401,  # import-error

[FORMAT]
max-line-length=120
max-module-lines=1000
indent-string='    '

[DESIGN]
max-args=10
max-attributes=15
max-bool-expr=5
max-branches=15
max-locals=20
max-parents=7
max-public-methods=25
max-returns=6
max-statements=50
```

### Key Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **fail-under** | 7.0 | Minimum score (0-10) required to pass |
| **max-line-length** | 120 | Maximum characters per line |
| **output-format** | colorized | Colored terminal output |
| **reports** | no | Don't show full report, just messages |

## 📊 Understanding Pylint Output

### Score System
- **10.0**: Perfect code
- **7.0+**: Good quality (minimum required)
- **5.0-7.0**: Needs improvement
- **<5.0**: Poor quality

### Message Types
- **C**: Convention (coding standard violation)
- **R**: Refactor (code smell)
- **W**: Warning (potential issue)
- **E**: Error (probable bug)
- **F**: Fatal (prevents further processing)

### Example Output
```
************* Module app.main
app/main.py:15:0: C0301: Line too long (125/120) (line-too-long)
app/main.py:42:4: W0612: Unused variable 'result' (unused-variable)
app/main.py:58:0: R0914: Too many local variables (16/20) (too-many-locals)

-----------------------------------
Your code has been rated at 8.45/10
```

## 🔧 Customizing Pylint

### Disable Specific Warnings

**In code (inline):**
```python
# pylint: disable=line-too-long
very_long_line_that_exceeds_the_limit = "some very long string..."

# pylint: disable=unused-argument
def function_with_unused_arg(required_arg, unused_arg):
    return required_arg
```

**In .pylintrc:**
```ini
[MESSAGES CONTROL]
disable=
    C0301,  # line-too-long
    W0612,  # unused-variable
```

### Adjust Thresholds

```ini
[DESIGN]
max-args=15  # Increase from 10
max-line-length=150  # Increase from 120
```

### Change Minimum Score

```ini
[MASTER]
fail-under=8.0  # Increase from 7.0
```

## 🐛 Common Issues and Fixes

### Issue: Import Errors in Docker

**Problem:**
```
E0401: Unable to import 'fastapi' (import-error)
```

**Solution:**
This is already disabled in `.pylintrc`. If you see this, ensure the configuration is being loaded:
```bash
docker-compose --profile testing run --rm device_pylint ls -la .pylintrc
```

### Issue: Too Many False Positives

**Solution:**
Add specific disables to `.pylintrc`:
```ini
[MESSAGES CONTROL]
disable=
    R0903,  # too-few-public-methods (common in Pydantic models)
    R0913,  # too-many-arguments (common in FastAPI endpoints)
```

### Issue: Score Below Threshold

**Solution:**
1. Review the specific warnings
2. Fix critical issues (E, F)
3. Address warnings (W)
4. Consider refactoring (R)
5. Adjust conventions (C) or disable if not applicable

## 📈 Best Practices

### 1. Run Pylint Regularly
```bash
# Before committing
./run-device-tests.sh lint-only

# In pre-commit hook
docker-compose --profile testing run --rm device_pylint
```

### 2. Fix Issues Incrementally
- Start with errors (E) and fatal (F)
- Then warnings (W)
- Then refactoring suggestions (R)
- Finally conventions (C)

### 3. Use Inline Disables Sparingly
```python
# Good: Specific, justified disable
# pylint: disable=broad-except  # Need to catch all exceptions here for logging
try:
    risky_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}")

# Bad: Blanket disable
# pylint: disable=all
```

### 4. Keep .pylintrc in Version Control
Ensure all team members use the same configuration.

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Pylint
  run: docker-compose --profile testing run --rm device_pylint
```

### Jenkins
```groovy
stage('Code Quality') {
    steps {
        sh 'docker-compose --profile testing run --rm device_pylint'
    }
}
```

### GitLab CI
```yaml
pylint:
  script:
    - docker-compose --profile testing run --rm device_pylint
  allow_failure: false
```

## 📊 Generating Reports

### HTML Report
```bash
docker-compose --profile testing run --rm device_pylint \
  pylint app --output-format=html > pylint_report.html
```

### JSON Report (for parsing)
```bash
docker-compose --profile testing run --rm device_pylint \
  pylint app --output-format=json > pylint_report.json
```

### Detailed Report
```bash
docker-compose --profile testing run --rm device_pylint \
  pylint app --reports=yes
```

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `lint` | Run pylint with test container |
| `lint-only` | Run pylint with dedicated container (faster) |
| `docker-compose --profile testing run --rm device_pylint` | Direct pylint execution |
| `docker-compose --profile testing run --rm device_tests pylint app` | Pylint via test container |

## 📚 Additional Resources

- [Pylint Documentation](https://pylint.pycqa.org/)
- [Pylint Messages](https://pylint.pycqa.org/en/latest/user_guide/messages/messages_overview.html)
- [Pylint Configuration](https://pylint.pycqa.org/en/latest/user_guide/configuration/index.html)

---

**Configuration File**: `device/.pylintrc`  
**Minimum Score**: 7.0/10  
**Pylint Version**: 3.0+
