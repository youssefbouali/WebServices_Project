describe('Admin Dashboard', () => {
    beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.login(users.admin.email, users.admin.password);
        });
    });

    describe('Dashboard Access', () => {
        it('should access admin dashboard', () => {
            cy.visit('/admin-dashboard');
            cy.url().should('include', '/admin-dashboard');
        });

        it('should display admin dashboard content', () => {
            cy.visit('/admin-dashboard');
            cy.contains(/admin|dashboard/i).should('be.visible');
        });
    });

    describe('User Management', () => {
        it('should access roles management', () => {
            cy.visit('/roles-management');
            cy.url().should('include', '/roles-management');
        });

        it('should display roles management page', () => {
            cy.visit('/roles-management');
            cy.contains(/role/i).should('be.visible');
        });
    });

    describe('Profile Management', () => {
        it('should access profiles dashboard', () => {
            cy.visit('/profiles');
            cy.url().should('include', '/profiles');
        });

        it('should display profiles list', () => {
            cy.visit('/profiles');
            cy.contains(/profile/i).should('be.visible');
        });

        it('should navigate to profile detail', () => {
            cy.visit('/profiles');
            // Wait for profiles to load and click on first profile if available
            cy.get('body').then(($body) => {
                if ($body.find('a[href*="/profiles/detail"]').length > 0) {
                    cy.get('a[href*="/profiles/detail"]').first().click();
                    cy.url().should('include', '/profiles/detail');
                }
            });
        });

        it('should navigate to profile edit', () => {
            cy.visit('/profiles');
            // Wait for profiles to load and click on edit if available
            cy.get('body').then(($body) => {
                if ($body.find('a[href*="/profiles/edit"]').length > 0) {
                    cy.get('a[href*="/profiles/edit"]').first().click();
                    cy.url().should('include', '/profiles/edit');
                }
            });
        });
    });

    describe('Admin Permissions', () => {
        it('should have access to all admin routes', () => {
            const adminRoutes = [
                '/admin-dashboard',
                '/roles-management',
                '/profiles',
            ];

            adminRoutes.forEach((route) => {
                cy.visit(route);
                cy.url().should('include', route);
                // Should not redirect to login or error page
                cy.url().should('not.include', '/login');
            });
        });
    });

    describe('General Features Access', () => {
        it('should access alerts management', () => {
            cy.visit('/alerts');
            cy.url().should('include', '/alerts');
        });

        it('should access monitoring', () => {
            cy.visit('/monitoring');
            cy.url().should('include', '/monitoring');
        });

        it('should access appointments', () => {
            cy.visit('/appointments');
            cy.url().should('include', '/appointments');
        });

        it('should access device registration', () => {
            cy.visit('/device-registration');
            cy.url().should('include', '/device-registration');
        });
    });
});
