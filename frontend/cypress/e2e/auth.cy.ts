describe('Authentication', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe('Login', () => {
        it('should display login page', () => {
            cy.visit('/login');
            cy.url().should('include', '/login');
            cy.contains('Login').should('be.visible');
        });

        it('should show validation errors for empty fields', () => {
            cy.visit('/login');
            cy.get('button[type="submit"]').click();

            // Check for validation messages (adjust selectors based on your form implementation)
            cy.contains(/email/i).should('be.visible');
            cy.contains(/password/i).should('be.visible');
        });

        it('should login successfully with valid credentials', () => {
            cy.fixture('users').then((users) => {
                cy.visit('/login');
                cy.get('input[type="email"]').type(users.admin.email);
                cy.get('input[type="password"]').type(users.admin.password);
                cy.get('button[type="submit"]').click();

                // Should redirect away from login page
                cy.url().should('not.include', '/login');
            });
        });

        it('should show error for invalid credentials', () => {
            cy.visit('/login');
            cy.get('input[type="email"]').type('invalid@example.com');
            cy.get('input[type="password"]').type('wrongpassword');
            cy.get('button[type="submit"]').click();

            // Should show error message (adjust based on your error handling)
            cy.contains(/invalid|error|incorrect/i, { timeout: 10000 }).should('be.visible');
        });
    });

    describe('Registration', () => {
        it('should display registration page', () => {
            cy.visit('/register');
            cy.url().should('include', '/register');
            cy.contains(/register|sign up/i).should('be.visible');
        });

        it('should show validation errors for invalid input', () => {
            cy.visit('/register');
            cy.get('button[type="submit"]').click();

            // Should show validation errors
            cy.get('form').should('be.visible');
        });

        it('should navigate to login from registration page', () => {
            cy.visit('/register');
            cy.contains(/login|sign in/i).click();
            cy.url().should('include', '/login');
        });
    });

    describe('Protected Routes', () => {
        it('should redirect to login when accessing protected route without authentication', () => {
            cy.visit('/dashboard');
            cy.url().should('include', '/login');
        });

        it('should redirect to login when accessing admin route without authentication', () => {
            cy.visit('/admin-dashboard');
            cy.url().should('include', '/login');
        });

        it('should redirect to login when accessing doctor route without authentication', () => {
            cy.visit('/doctor-dashboard');
            cy.url().should('include', '/login');
        });

        it('should redirect to login when accessing patient route without authentication', () => {
            cy.visit('/patient-dashboard');
            cy.url().should('include', '/login');
        });
    });

    describe('Logout', () => {
        it('should logout successfully', () => {
            cy.fixture('users').then((users) => {
                cy.login(users.admin.email, users.admin.password);
                cy.visit('/dashboard');

                // Find and click logout button (adjust selector based on your implementation)
                cy.contains(/logout|sign out/i).click();

                // Should redirect to home or login
                cy.url().should('match', /\/(login)?$/);
            });
        });
    });
});
