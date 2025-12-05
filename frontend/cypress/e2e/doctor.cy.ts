describe('Doctor Dashboard', () => {
    beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.login(users.doctor.email, users.doctor.password);
        });
    });

    describe('Dashboard Access', () => {
        it('should access doctor dashboard', () => {
            cy.visit('/doctor-dashboard');
            cy.url().should('include', '/doctor-dashboard');
        });

        it('should display doctor dashboard content', () => {
            cy.visit('/doctor-dashboard');
            cy.contains(/doctor|dashboard/i).should('be.visible');
        });

        it('should not access admin routes', () => {
            cy.visit('/admin-dashboard', { failOnStatusCode: false });
            // Should redirect or show error
            cy.url().should('not.include', '/admin-dashboard');
        });
    });

    describe('Patient Management', () => {
        it('should access patients list', () => {
            cy.visit('/doctor/mes-patients');
            cy.url().should('include', '/doctor/mes-patients');
        });

        it('should display patients page', () => {
            cy.visit('/doctor/mes-patients');
            cy.contains(/patient/i).should('be.visible');
        });
    });

    describe('Appointments Management', () => {
        it('should access appointments page', () => {
            cy.visit('/doctor/appointments');
            cy.url().should('include', '/doctor/appointments');
        });

        it('should access French appointments route', () => {
            cy.visit('/doctor/rendez-vous');
            cy.url().should('include', '/doctor/rendez-vous');
        });

        it('should display appointments list', () => {
            cy.visit('/doctor/appointments');
            cy.contains(/appointment|rendez-vous/i).should('be.visible');
        });
    });

    describe('Alerts Management', () => {
        it('should access doctor alerts', () => {
            cy.visit('/doctor/alertes');
            cy.url().should('include', '/doctor/alertes');
        });

        it('should display alerts page', () => {
            cy.visit('/doctor/alertes');
            cy.contains(/alert/i).should('be.visible');
        });
    });

    describe('Treatment Tracking', () => {
        it('should access treatment tracking', () => {
            cy.visit('/doctor/suivi-traitements');
            cy.url().should('include', '/doctor/suivi-traitements');
        });

        it('should display treatment tracking page', () => {
            cy.visit('/doctor/suivi-traitements');
            cy.contains(/treatment|traitement/i).should('be.visible');
        });
    });

    describe('Device Management', () => {
        it('should access doctor devices', () => {
            cy.visit('/doctor/devices');
            cy.url().should('include', '/doctor/devices');
        });

        it('should display devices page', () => {
            cy.visit('/doctor/devices');
            cy.contains(/device|appareil/i).should('be.visible');
        });
    });

    describe('Doctor Permissions', () => {
        it('should have access to all doctor routes', () => {
            const doctorRoutes = [
                '/doctor-dashboard',
                '/doctor/mes-patients',
                '/doctor/appointments',
                '/doctor/rendez-vous',
                '/doctor/alertes',
                '/doctor/suivi-traitements',
                '/doctor/devices',
            ];

            doctorRoutes.forEach((route) => {
                cy.visit(route);
                cy.url().should('include', route);
                // Should not redirect to login
                cy.url().should('not.include', '/login');
            });
        });

        it('should not have access to admin-only routes', () => {
            const adminRoutes = [
                '/admin-dashboard',
                '/roles-management',
                '/profiles',
            ];

            adminRoutes.forEach((route) => {
                cy.visit(route, { failOnStatusCode: false });
                // Should not be on admin route
                cy.url().should('not.include', route);
            });
        });

        it('should not have access to patient-only routes', () => {
            cy.visit('/patient-dashboard', { failOnStatusCode: false });
            cy.url().should('not.include', '/patient-dashboard');
        });
    });
});
