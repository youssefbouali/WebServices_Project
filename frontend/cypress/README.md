# Cypress Testing Guide

This directory contains end-to-end (E2E) and component tests for the HealthFront application using Cypress.

## 📁 Directory Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── auth.cy.ts         # Authentication tests
│   ├── navigation.cy.ts   # Navigation tests
│   ├── admin.cy.ts        # Admin-specific tests
│   ├── doctor.cy.ts       # Doctor-specific tests
│   └── patient.cy.ts      # Patient-specific tests
├── fixtures/              # Test data
│   ├── users.json        # User credentials for testing
│   ├── appointments.json # Sample appointment data
│   └── devices.json      # Sample device data
├── support/              # Support files and custom commands
│   ├── commands.ts       # Custom Cypress commands
│   ├── e2e.ts           # E2E support file
│   ├── component.ts     # Component testing support
│   └── index.d.ts       # TypeScript definitions
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

1. Install dependencies:
```bash
pnpm install
```

2. Make sure your development server is running:
```bash
pnpm run dev
```

The application should be running on `http://localhost:5173` (default Vite port).

## 🧪 Running Tests

### Interactive Mode (Cypress Test Runner)

Open the Cypress Test Runner to run tests interactively:

```bash
pnpm run cypress:open
```

This will open the Cypress UI where you can:
- Select E2E or Component testing
- Choose a browser
- Run individual test files
- Watch tests run in real-time
- Debug failing tests

### Headless Mode

Run all tests in headless mode (useful for CI/CD):

```bash
pnpm run cypress:run
```

### Run in Specific Browser

Run tests in Chrome:
```bash
pnpm run cypress:run:chrome
```

Run tests in Firefox:
```bash
pnpm run cypress:run:firefox
```

## 📝 Test Suites

### Authentication Tests (`auth.cy.ts`)
- Login functionality
- Registration flow
- Protected route access
- Logout functionality
- Form validation

### Navigation Tests (`navigation.cy.ts`)
- Landing page navigation
- Authenticated navigation
- 404 error handling
- Browser back/forward navigation

### Admin Tests (`admin.cy.ts`)
- Admin dashboard access
- User role management
- Profile management
- Admin-specific permissions

### Doctor Tests (`doctor.cy.ts`)
- Doctor dashboard access
- Patient management
- Appointment management
- Treatment tracking
- Device management
- Role-based access control

### Patient Tests (`patient.cy.ts`)
- Patient dashboard access
- Profile viewing
- Appointment booking
- Alert viewing
- Treatment tracking
- Device viewing
- Role-based access control

## 🛠️ Custom Commands

We've created several custom commands to make testing easier:

### `cy.login(email, password)`
Login with specific credentials:
```typescript
cy.login('admin@healthfront.com', 'Admin123!');
```

### `cy.loginAsRole(role)`
Login using fixture data for a specific role:
```typescript
cy.loginAsRole('admin');    // Login as admin
cy.loginAsRole('doctor');   // Login as doctor
cy.loginAsRole('patient');  // Login as patient
```

### `cy.dataCy(value)`
Select elements by `data-cy` attribute:
```typescript
cy.dataCy('submit-button').click();
```

### `cy.logout()`
Logout and clear session:
```typescript
cy.logout();
```

## 📊 Test Data (Fixtures)

Test data is stored in the `fixtures/` directory:

### Users (`users.json`)
Contains test user credentials for different roles:
- Admin user
- Doctor user
- Patient user

**Note:** These are test credentials. Update them to match your actual test users or use API calls to create test users dynamically.

### Appointments (`appointments.json`)
Sample appointment data for testing appointment-related features.

### Devices (`devices.json`)
Sample device data for testing device management features.

## ✍️ Writing New Tests

### Basic Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.visit('/your-page');
  });

  it('should do something', () => {
    // Test implementation
    cy.get('button').click();
    cy.contains('Success').should('be.visible');
  });
});
```

### Testing Authenticated Routes

```typescript
describe('Protected Feature', () => {
  beforeEach(() => {
    // Login before each test
    cy.loginAsRole('admin');
    cy.visit('/protected-route');
  });

  it('should access protected feature', () => {
    cy.url().should('include', '/protected-route');
  });
});
```

### Using Fixtures

```typescript
it('should use fixture data', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.admin.email, users.admin.password);
  });
});
```

## 🎯 Best Practices

1. **Use data-cy attributes**: Add `data-cy` attributes to elements you want to test for more stable selectors
   ```html
   <button data-cy="submit-button">Submit</button>
   ```

2. **Keep tests independent**: Each test should be able to run independently
   ```typescript
   beforeEach(() => {
     // Reset state before each test
   });
   ```

3. **Use custom commands**: Leverage custom commands for common operations
   ```typescript
   cy.loginAsRole('admin'); // Instead of repeating login steps
   ```

4. **Wait for elements**: Use Cypress's built-in retry-ability
   ```typescript
   cy.get('.loading').should('not.exist');
   cy.contains('Data loaded').should('be.visible');
   ```

5. **Test user flows, not implementation**: Focus on what users do, not how the code works
   ```typescript
   // Good
   it('should allow user to book appointment', () => {
     cy.visit('/appointments/new');
     cy.get('input[name="date"]').type('2024-12-10');
     cy.get('button[type="submit"]').click();
     cy.contains('Appointment booked').should('be.visible');
   });
   
   // Avoid testing implementation details
   ```

6. **Use meaningful test descriptions**: Make it clear what the test is verifying
   ```typescript
   it('should show error message when email is invalid');
   ```

## 🔧 Configuration

The Cypress configuration is in `cypress.config.ts`:

- **baseUrl**: `http://localhost:5173` (Vite default)
- **viewportWidth**: 1280px
- **viewportHeight**: 720px
- **video**: Enabled (videos saved on failure)
- **screenshots**: Enabled on failure

## 🐛 Debugging

### Interactive Debugging
1. Open Cypress Test Runner: `pnpm run cypress:open`
2. Click on a test to run it
3. Use the time-travel feature to see each step
4. Click on commands to see snapshots
5. Use browser DevTools for debugging

### Console Logs
```typescript
cy.get('.element').then(($el) => {
  console.log('Element:', $el);
});
```

### Pause Execution
```typescript
cy.pause(); // Pauses test execution
```

### Debug Command
```typescript
cy.get('.element').debug(); // Opens debugger
```

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress TypeScript Support](https://docs.cypress.io/guides/tooling/typescript-support)
- [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)

## 🤝 Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Add comments for complex test logic
4. Update this README if adding new test suites
5. Ensure tests pass before committing

## 📋 Test Checklist

Before committing:
- [ ] All tests pass locally
- [ ] New features have corresponding tests
- [ ] Tests are independent and can run in any order
- [ ] Test names clearly describe what is being tested
- [ ] No hardcoded waits (use Cypress's retry-ability)
- [ ] Fixtures are updated if needed
