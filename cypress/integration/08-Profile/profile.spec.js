/// <reference types="cypress" />

let user = {};

describe("Profile tests", () => {
  before(() =>
    cy.fixture("testUser").then((testUser) => {
      user = testUser;
      cy.login(user);
    })
  );

  afterEach(() => {
    cy.visit("/");
  });

  // final logout
  after(() => {
    cy.get("#logout").click({ force: true });
  });

  it("Should have 2 menu lines", () => {
    let profileIdx = 7;
    cy.get(".dropdown").then((item) => (profileIdx = item.length - 1));

    // we have to access profileIdx asynchronously, so wrap it with ".then"
    cy.then(() => {
      cy.get(".dropdown")
        .eq(profileIdx)
        .within(() => {
          cy.get("a").eq(0).click({ force: true });
        });
    });
  });
});
