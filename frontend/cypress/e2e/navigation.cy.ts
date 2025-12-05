describe('Navigation', () => {
    describe('Landing Page', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should display landing page', () => {
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('should have navigation to login', () => {
            cy.contains(/login|sign in/i).should('be.visible');
        });

        it('should have navigation to register', () => {
            cy.contains(/register|sign up|get started/i).should('be.visible');
        });

        it('should navigate to login page', () => {
            cy.contains(/login|sign in/i).first().click();
            cy.url().should('include', '/login');
        });

        it('should navigate to register page', () => {
            cy.contains(/register|sign up|get started/i).first().click();
            cy.url().should('include', '/register');
        });
    });

    describe('Authenticated Navigation', () => {
        beforeEach(() => {
            cy.fixture('users').then((users) => {
                cy.login(users.admin.email, users.admin.password);
            });
        });

        it('should navigate to dashboard', () => {
            cy.visit('/dashboard');
            cy.url().should('include', '/dashboard');
        });

        it('should navigate to alerts management', () => {
            cy.visit('/alerts');
            cy.url().should('include', '/alerts');
        });

        it('should navigate to monitoring', () => {
            cy.visit('/monitoring');
            cy.url().should('include', '/monitoring');
        });

        it('should navigate to appointments', () => {
            cy.visit('/appointments');
            cy.url().should('include', '/appointments');
        });
    });

    describe('404 Not Found', () => {
        it('should show 404 page for invalid route', () => {
            cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });
            cy.contains(/404|not found/i).should('be.visible');
        });
    });

    describe('Browser Navigation', () => {
        beforeEach(() => {
            cy.fixture('users').then((users) => {
                cy.login(users.admin.email, users.admin.password);
            });
        });

        it('should handle browser back button', () => {
            cy.visit('/dashboard');
            cy.visit('/appointments');
            cy.go('back');
            cy.url().should('include', '/dashboard');
        });

        it('should handle browser forward button', () => {
            cy.visit('/dashboard');
            cy.visit('/appointments');
            cy.go('back');
            cy.go('forward');
            cy.url().should('include', '/appointments');
        });
    });
});
