/// <reference types="cypress" />

let msg;
let user = {};

describe("Register page tests", () => {
  before(() => cy.fixture("testUser").then((testUser) => (user = testUser)));

  beforeEach(() => {
    // save roleList
    cy.intercept("/roles").as("rolesList");

    cy.visit("/");

    // redirect to register page and get roles
    cy.get("#register").click();
  });

  it("Should be redirected to register page from login page", () => {
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/register`);
  });

  //it("Should have non-empty roles list on the loaded register page", () => {
  //  // check GET response. We have at least one role
  //  cy.wait("@rolesList").should(({ response }) => {
  //    expect(response.statusCode).to.equal(200);
  //    expect(response.body).to.length.gte(1);
  //    expect(response.body[0]).to.have.property("id");
  //    expect(response.body[0]).to.have.property("roleName");
  //  });
  //});

  it("Should exists register page controls", () => {
    cy.get("#name").should("exist");
    cy.get("#password").should("exist");
    cy.get("#password-cnf").should("exist");
    cy.get("#firstName").should("exist");
    cy.get("#lastName").should("exist");
    cy.get("#email").should("exist");
    cy.get("#phone").should("exist");
    //cy.get(".rdl-control").should("exist");
    //cy.get(".rdl-control").should("have.length", 2);
    //
    //cy.get(".rdl-move-all.rdl-move-right").should("exist");
    //cy.get(".rdl-move.rdl-move-right").should("exist");
    //cy.get(".rdl-move.rdl-move-left").should("exist");
    //cy.get(".rdl-move-all.rdl-move-left").should("exist");

    cy.get("#register").should("exist").should("have.value", "Register");
    cy.get("#cancel").should("exist").should("have.value", "Cancel");
  });

  //it("Choice buttons should have actions", () => {
  //  cy.get('[aria-label="Move right"]').click();
  //  cy.get('[aria-label="Move all right"]').click();
  //  cy.get('[aria-label="Move left"]').click();
  //  cy.get('[aria-label="Move all left"]').click();
  //});

  it("Cancel register click event", () => {
    cy.get("#cancel").click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/login`);
  });

  it("Incorrent user registration - some fields are empty", () => {
    cy.get("#name")
      .type(user.name)
      .should("have.value", user.name)
      .should("not.have.value", "");
    cy.get(".info").should("have.value", "");

    cy.get("#password")
      .type(user.pass)
      .should("have.value", user.pass)
      .should("not.have.value", "");
    cy.get(".info").contains("p", "Passwords mismatch");

    cy.get("#register").click();

    cy.get(".info").contains("p", "Required fields must be filled");
  });

  it("Incorrent user registration - already exist", () => {
    cy.get("#name")
      .type(user.name)
      .should("have.value", user.name)
      .should("not.have.value", "");
    cy.get(".info").should("have.value", "");

    cy.get("#password")
      .type(user.pass)
      .should("have.value", user.pass)
      .should("not.have.value", "");
    cy.get(".info").contains("p", "Passwords mismatch");

    cy.get("#password-cnf")
      .type(user.pass)
      .should("have.value", user.pass)
      .should("not.have.value", "");
    cy.get(".info").should("have.value", "");

    cy.get("#firstName")
      .type(user.firstName)
      .should("have.value", user.firstName)
      .should("not.have.value", "");

    cy.get("#lastName")
      .type(user.lastName)
      .should("have.value", user.lastName)
      .should("not.have.value", "");

    cy.get("#email")
      .type(user.email)
      .should("have.value", user.email)
      .should("not.have.value", "");

    //cy.get('[aria-label="Move all right"]').click();

    msg =
      "Registration Error: There is already a user registered with the username provided !!!";
    cy.intercept(
      { method: "POST", url: "/register" },
      { statusCode: 400, body: msg }
    ).as("existUser");

    cy.get("#register").click();

    cy.wait("@existUser").should(({ request, response }) => {
      console.log;
      expect(response.statusCode).equal(400);
      cy.get(".info").contains("p", msg);
    });
  });

  it("Successfull user registration", () => {
    // stubb POST user
    cy.intercept({ method: "POST", url: "/register" }, { statusCode: 201 }).as(
      "postUser"
    );

    cy.get("#name")
      .type(user.name)
      .should("have.value", user.name)
      .should("not.have.value", "");
    cy.get(".info").should("have.value", "");

    cy.get("#password")
      .type(user.pass)
      .should("have.value", user.pass)
      .should("not.have.value", "");
    cy.get(".info").contains("p", "Passwords mismatch");

    cy.get("#password-cnf")
      .type(user.pass)
      .should("have.value", user.pass)
      .should("not.have.value", "");
    cy.get(".info").should("have.value", "");

    cy.get("#firstName")
      .type(user.firstName)
      .should("have.value", user.firstName)
      .should("not.have.value", "");

    cy.get("#lastName")
      .type(user.lastName)
      .should("have.value", user.lastName)
      .should("not.have.value", "");

    cy.get("#email")
      .type(user.email)
      .should("have.value", user.email)
      .should("not.have.value", "");

    //cy.get('[aria-label="Move all right"]').click();

    cy.get("#register").click();

    cy.wait("@postUser");

    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/login`);
  });
});
