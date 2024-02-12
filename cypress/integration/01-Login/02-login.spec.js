/// <reference types="cypress" />

let user = {};

describe("Login page tests", () => {
  before(() => cy.fixture("testUser").then((testUser) => (user = testUser)));

  beforeEach(() => cy.visit("/"));

  it("On start should be redirected to the login page", () => {
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/login`);
  });

  it("Login page controls", () => {
    cy.get("#name").should("exist");
    cy.get("#password").should("exist");
    cy.get("#login").should("exist");
    cy.get("#register").should("exist");
  });

  it("Login non-existent user", () => {
    cy.get("#name").type(user.name).should("have.value", user.name);
    cy.get("#password").type(user.pass).should("have.value", user.pass);

    // click doing POST with unregistered user
    cy.get("#login")
      .click()
      .then(() => {
        cy.get(".info").contains("Current user has no login privilege");
      });
  });

  it("Login should be successfull", () => {
    cy.login(user);
  });

  it("Logout click event", () => {
    cy.get("#logout").click({ force: true });
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/login`);
  });
});
