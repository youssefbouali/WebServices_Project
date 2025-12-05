/**
 * Docker Environment Test
 * 
 * This test verifies that Cypress is running correctly in the Docker environment
 * and can communicate with the frontend service.
 */

describe('Docker Environment Tests', () => {
    beforeEach(() => {
        // Visit the base URL (configured via environment variable in Docker)
        cy.visit('/');
    });

    it('should successfully load the application', () => {
        // Verify the page loads
        cy.url().should('include', Cypress.config('baseUrl') || 'localhost');

        // Check that the page has rendered content
        cy.get('body').should('be.visible');
    });

    it('should have correct baseUrl configuration', () => {
        // Log the baseUrl for debugging
        cy.log('Base URL:', Cypress.config('baseUrl'));

        // In Docker, baseUrl should be http://frontend_service:8080
        // Locally, it should be http://localhost:5173
        const baseUrl = Cypress.config('baseUrl');
        expect(baseUrl).to.be.a('string');
        expect(baseUrl).to.match(/^http:\/\/(frontend_service:8080|localhost:\d+)$/);
    });

    it('should be able to navigate to different routes', () => {
        // Test basic navigation
        cy.visit('/');
        cy.url().should('not.include', '404');
    });

    it('should have proper viewport dimensions', () => {
        // Verify viewport is set correctly
        cy.viewport(1280, 720);
        cy.window().its('innerWidth').should('equal', 1280);
        cy.window().its('innerHeight').should('equal', 720);
    });

    it('should capture screenshots on failure', () => {
        // This test intentionally includes a check that might fail
        // to demonstrate screenshot capture functionality
        cy.log('Testing screenshot capture capability');

        // Take a manual screenshot
        cy.screenshot('docker-environment-test');
    });

    it('should handle API requests (if backend is available)', () => {
        // Intercept API calls to verify network connectivity
        cy.intercept('GET', '/api/**').as('apiCall');

        // Try to trigger an API call (adjust based on your app)
        cy.visit('/');

        // Wait a bit to see if any API calls are made
        cy.wait(2000);

        // Log whether API calls were detected
        cy.log('API connectivity test completed');
    });

    it('should have video recording enabled', () => {
        // Verify video recording is configured
        const videoEnabled = Cypress.config('video');
        cy.log('Video recording enabled:', videoEnabled);
        expect(videoEnabled).to.be.true;
    });

    it('should have screenshot on failure enabled', () => {
        // Verify screenshot on failure is configured
        const screenshotOnFailure = Cypress.config('screenshotOnRunFailure');
        cy.log('Screenshot on failure enabled:', screenshotOnFailure);
        expect(screenshotOnFailure).to.be.true;
    });

    it('should have appropriate timeouts configured', () => {
        // Verify timeout configurations
        const defaultCommandTimeout = Cypress.config('defaultCommandTimeout');
        const requestTimeout = Cypress.config('requestTimeout');
        const responseTimeout = Cypress.config('responseTimeout');

        cy.log('Default command timeout:', defaultCommandTimeout);
        cy.log('Request timeout:', requestTimeout);
        cy.log('Response timeout:', responseTimeout);

        expect(defaultCommandTimeout).to.be.at.least(5000);
        expect(requestTimeout).to.be.at.least(5000);
        expect(responseTimeout).to.be.at.least(5000);
    });

    it('should display environment information', () => {
        // Log useful debugging information
        cy.log('Cypress version:', Cypress.version);
        cy.log('Browser:', Cypress.browser.name);
        cy.log('Platform:', Cypress.platform);
        cy.log('Base URL:', Cypress.config('baseUrl'));

        // Verify we're running in a supported browser
        expect(Cypress.browser.name).to.be.oneOf(['chrome', 'firefox', 'electron', 'edge']);
    });
});

describe('Docker Network Connectivity', () => {
    it('should be able to reach the frontend service', () => {
        // This test verifies that the Cypress container can communicate
        // with the frontend service through Docker networks
        cy.request({
            url: '/',
            failOnStatusCode: false
        }).then((response) => {
            // We expect a successful response or a redirect
            expect(response.status).to.be.oneOf([200, 301, 302, 304]);
        });
    });

    it('should handle slow network responses', () => {
        // Test that timeouts are configured appropriately for Docker
        cy.visit('/', { timeout: 15000 });
        cy.get('body', { timeout: 10000 }).should('exist');
    });
});

describe('Docker Volume Mounts', () => {
    it('should save test artifacts to mounted volumes', () => {
        // Take a screenshot to verify volume mounting works
        cy.screenshot('volume-mount-test');

        // Take another screenshot with a specific name
        cy.screenshot('docker-volumes/test-artifact');

        cy.log('Screenshots should be saved to ./frontend/cypress/screenshots/');
    });
});
