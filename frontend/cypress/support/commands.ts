/// <reference types="cypress" />

/**
 * Custom command to login with email and password
 */
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.session([email, password], () => {
        cy.visit('/login');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();

        // Wait for redirect after successful login
        cy.url().should('not.include', '/login');
    });
});

/**
 * Custom command to login as a specific role using fixture data
 */
Cypress.Commands.add('loginAsRole', (role: 'admin' | 'doctor' | 'patient') => {
    cy.fixture('users').then((users) => {
        const user = users[role];
        cy.login(user.email, user.password);
    });
});

/**
 * Custom command to select elements by data-cy attribute
 */
Cypress.Commands.add('dataCy', (value: string) => {
    return cy.get(`[data-cy="${value}"]`);
});

/**
 * Custom command to logout
 */
Cypress.Commands.add('logout', () => {
    // Adjust this based on your actual logout implementation
    cy.window().then((win) => {
        win.localStorage.clear();
        win.sessionStorage.clear();
    });
    cy.visit('/');
});

// Prevent TypeScript errors
export { };
