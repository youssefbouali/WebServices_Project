describe('Patient Dashboard', () => {
    beforeEach(() => {
        cy.fixture('users').then((users) => {
            cy.login(users.patient.email, users.patient.password);
        });
    });

    describe('Dashboard Access', () => {
        it('should access patient dashboard', () => {
            cy.visit('/patient-dashboard');
            cy.url().should('include', '/patient-dashboard');
        });

        it('should display patient dashboard content', () => {
            cy.visit('/patient-dashboard');
            cy.contains(/patient|dashboard/i).should('be.visible');
        });

        it('should not access admin routes', () => {
            cy.visit('/admin-dashboard', { failOnStatusCode: false });
            cy.url().should('not.include', '/admin-dashboard');
        });

        it('should not access doctor routes', () => {
            cy.visit('/doctor-dashboard', { failOnStatusCode: false });
            cy.url().should('not.include', '/doctor-dashboard');
        });
    });

    describe('Profile Management', () => {
        it('should access patient profile', () => {
            cy.visit('/patient/profil');
            cy.url().should('include', '/patient/profil');
        });

        it('should display profile information', () => {
            cy.visit('/patient/profil');
            cy.contains(/profile|profil/i).should('be.visible');
        });
    });

    describe('Appointments Management', () => {
        it('should access appointments page', () => {
            cy.visit('/patient/appointments');
            cy.url().should('include', '/patient/appointments');
        });

        it('should access French appointments route', () => {
            cy.visit('/patient/rendez-vous');
            cy.url().should('include', '/patient/rendez-vous');
        });

        it('should display appointments list', () => {
            cy.visit('/patient/appointments');
            cy.contains(/appointment|rendez-vous/i).should('be.visible');
        });

        it('should access new appointment form', () => {
            cy.visit('/patient/appointments/new');
            cy.url().should('include', '/patient/appointments/new');
        });

        it('should display appointment form', () => {
            cy.visit('/patient/appointments/new');
            cy.get('form').should('be.visible');
        });

        it('should navigate to new appointment from appointments page', () => {
            cy.visit('/patient/appointments');
            // Look for "New" or "Create" button
            cy.get('body').then(($body) => {
                if ($body.find('a[href*="/appointments/new"]').length > 0) {
                    cy.get('a[href*="/appointments/new"]').first().click();
                    cy.url().should('include', '/appointments/new');
                }
            });
        });
    });

    describe('Alerts Management', () => {
        it('should access patient alerts', () => {
            cy.visit('/patient/alertes');
            cy.url().should('include', '/patient/alertes');
        });

        it('should display alerts page', () => {
            cy.visit('/patient/alertes');
            cy.contains(/alert/i).should('be.visible');
        });
    });

    describe('Treatment Tracking', () => {
        it('should access treatment tracking', () => {
            cy.visit('/patient/suivi-traitements');
            cy.url().should('include', '/patient/suivi-traitements');
        });

        it('should display treatment tracking page', () => {
            cy.visit('/patient/suivi-traitements');
            cy.contains(/treatment|traitement/i).should('be.visible');
        });
    });

    describe('Device Management', () => {
        it('should access patient devices', () => {
            cy.visit('/patient/devices');
            cy.url().should('include', '/patient/devices');
        });

        it('should display devices page', () => {
            cy.visit('/patient/devices');
            cy.contains(/device|appareil/i).should('be.visible');
        });
    });

    describe('Patient Permissions', () => {
        it('should have access to all patient routes', () => {
            const patientRoutes = [
                '/patient-dashboard',
                '/patient/profil',
                '/patient/appointments',
                '/patient/rendez-vous',
                '/patient/appointments/new',
                '/patient/alertes',
                '/patient/suivi-traitements',
                '/patient/devices',
            ];

            patientRoutes.forEach((route) => {
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
                cy.url().should('not.include', route);
            });
        });

        it('should not have access to doctor-only routes', () => {
            const doctorRoutes = [
                '/doctor-dashboard',
                '/doctor/mes-patients',
            ];

            doctorRoutes.forEach((route) => {
                cy.visit(route, { failOnStatusCode: false });
                cy.url().should('not.include', route);
            });
        });
    });
});
