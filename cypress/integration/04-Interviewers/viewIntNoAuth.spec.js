/// <reference types="Cypress" />

let user = {};

describe("user is not admin/recuiter, no auth", () => {
  //login user
  before(() => {
    cy.window()
      .then((win) => {
        win.sessionStorage.clear();
      })
      .then(() => {
        cy.fixture("testHR").then((testHR) => {
          user = testHR;
          cy.login(user);
        });
      });
  });

  // final logout
  // after(() => {
  //   cy.get("#logout").click({ force: true });
  // });

  beforeEach(() => {
    cy.intercept(
      { method: "GET", url: "/interviewer" },
      { fixture: "interviewers.json" }
    ).as("loadInterviewers");

    cy.visit("/viewinterviewers");
    cy.wait("@loadInterviewers");
  });

  it("edit/delete is disabled", () => {
    cy.get('[type="checkbox"]').eq(0).should("be.disabled");
    cy.get('[type="checkbox"]').eq(1).should("be.disabled");
    cy.get(".editBtn").eq(0).should("be.disabled");
    cy.get(".editBtn").eq(1).should("be.disabled");
  });
});
