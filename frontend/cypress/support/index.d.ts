/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to login as a specific user role
         * @example cy.login('admin@example.com', 'password123')
         */
        login(email: string, password: string): Chainable<void>;

        /**
         * Custom command to login with a specific role using fixture data
         * @example cy.loginAsRole('admin')
         */
        loginAsRole(role: 'admin' | 'doctor' | 'patient'): Chainable<void>;

        /**
         * Custom command to select DOM element by data-cy attribute
         * @example cy.dataCy('submit-button')
         */
        dataCy(value: string): Chainable<JQuery<HTMLElement>>;

        /**
         * Custom command to logout
         * @example cy.logout()
         */
        logout(): Chainable<void>;
    }
}

export { };
