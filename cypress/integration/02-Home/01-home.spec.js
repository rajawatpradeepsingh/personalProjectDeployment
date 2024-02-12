/// <reference types="cypress" />

let user = {};

// Recruiter user
describe("Home page tests with Recruiter role", () => {
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

  it("Should have brand header", () => {
    cy.get(".navbar-brand").contains("span", "Drishticon Recruitment Portal");
    cy.get("img").should("exist");
  });

  it("Should have Navigation Menu - buttons", () => {
    cy.get(".card-body").should("exist");
    cy.get(".dropdown")
      .should("exist")
      .should("have.length", 6)
      .each((el) => cy.wrap(el).find("button").click());
  });

  it("Check Home button exists", () => {
    cy.get("#home > .link").contains("Home");
  });

  it("Check Candidates button exists", () => {
    cy.get("#candidates").contains("Candidates");
  });
  it("Check Candidates menu context", () => {
    cy.get(".dropdown")
      .eq(1)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);

        cy.log("Check View Candidates exists");
        cy.get(`[href="/viewcandidates"]`).contains("View Candidates");

        cy.log("Check Create Candidate exists");
        cy.get(`[href="/createcandidate"]`).contains("Create Candidate");
      });
  });

  it("Check Interviewers button exists", () => {
    cy.get("#interviewers").contains("Interviewers");
  });
  it("Check Interviewers menu context", () => {
    cy.get(".dropdown")
      .eq(2)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);

        cy.log("Check View Interviewers exists");
        cy.get(`[href="/viewinterviewers"]`).contains("View Interviewers");

        cy.log("Check Create Interviewer exists");
        cy.get(`[href="/createinterviewer"]`).contains("Create Interviewer");
      });
  });

  it("Check Interviews button exists", () => {
    cy.get("#interviews").contains("Interviews");
  });
  it("Check Interviews menu context", () => {
    cy.get(".dropdown")
      .eq(3)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);

        cy.log("Check View Interviews exists");
        cy.get(`[href="/viewinterviews"]`).contains("View Interviews");

        cy.log("Check Create Interviewer exists");
        cy.get(`[href="/createinterview"]`).contains("Create Interview");
      });
  });

  it("Check Job Openings button exists", () => {
    cy.get("#jobs").contains("Job Openings");
  });
  it("Check Job Openings menu context", () => {
    cy.get(".dropdown")
      .eq(4)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 1);

        cy.log("Check View Jobs exists");
        cy.get(`[href="/viewjobs"]`).contains("View Jobs");

        cy.log("Check Create Jobs does not exists");
        cy.get(`[href="/createjob"]`).should("not.exist");
      });
  });

  it("Check Role button does not exists", () => {
    cy.get("#role").should("not.exist");
  });

  it("Check User button does not exists", () => {
    cy.get("#user").should("not.exist");
  });

  it("Check Profile button exists", () => {
    cy.get("#profile").contains("Profile");
  });
  it("Check Profile menu context", () => {
    cy.get(".dropdown")
      .eq(5)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 5);

        cy.log("Check User info exists");
        cy.get(`[href="/profile"]`).contains("User info");

        cy.log("Check Logout exists");
        cy.get("#logout").contains("Logout");
      });
  });

  it("Check home page context", () => {
    cy.get("section .container-fluid").should("exist");
    cy.get(".container-fluid p").contains("Welcome, ");
  });
});

// Admin user
describe("Home page tests with Admin roles", () => {
  before(() =>
    cy.fixture("testAdmin").then((testAdmin) => {
      user = testAdmin;
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

  it("Should have brand header", () => {
    cy.get(".navbar-brand").contains("span", "Drishticon Recruitment Portal");
    cy.get("img").should("exist");
  });

  it("Should have Navigation Menu - buttons", () => {
    cy.get(".card-body").should("exist");
    cy.get(".dropdown")
      .should("exist")
      .should("have.length", 8)
      .each((el) => cy.wrap(el).find("button").click());
  });

  it("Check Home button exists", () => {
    cy.get("#home > .link").contains("Home");
  });
  it("Check Home button events", () => {
    cy.get(".dropdown").eq(0).find("button").click();
    cy.url().should("be.equal", `${Cypress.config("baseUrl")}/`);
  });

  it("Check Candidates button exists", () => {
    cy.get("#candidates").contains("Candidates");
  });
  it("Check Candidates menu context", () => {
    cy.get(".dropdown")
      .eq(1)
      .then((el) => {
        cy.wrap(el)
          .trigger("mouseover")
          .children()
          .should("have.length", 2) // button, div
          .eq(1)
          .children()
          .should("have.length", 2); // hrefs
      });

    cy.get(".dropdown")
      .eq(1)
      .children()
      .eq(1)
      .within(() => {
        cy.log("Check View Candidates page URL");
        cy.get(`[href="/viewcandidates"]`).contains("View Candidates");
        //  .click({ force: true });
        //cy.url().should(
        //  "be.equal",
        //  `${Cypress.config("baseUrl")}/viewcandidates`
        //);
      })
      .within(() => {
        cy.log("Check Create Candidate page URL");
        cy.get(`[href="/createcandidate"]`).contains("Create Candidate");
        //  .click({ force: true });
        //cy.url().should(
        //  "be.equal",
        //  `${Cypress.config("baseUrl")}/createcandidate`
        //);
      });
  });

  it("Check Interviewers button exists", () => {
    cy.get("#interviewers").contains("Interviewers");
  });
  it("Check Interviewers menu context", () => {
    cy.get(".dropdown")
      .eq(2)
      .children()
      .should("have.length", 2)
      .contains("Interviewers");
    cy.get(".dropdown")
      .eq(2)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);
        cy.get(".dropdown-content")
          .within(() => {
            cy.log("Check View Interviewers page URL");
            cy.get(`[href="/viewinterviewers"]`).contains("View Interviewers");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/viewinterviewers`
            //);
          })
          .within(() => {
            cy.log("Check Create Interviewer page URL");
            cy.get(`[href="/createinterviewer"]`).contains(
              "Create Interviewer"
            );
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/createinterviewer`
            //);
          });
      });
  });

  it("Check Interviews button exists", () => {
    cy.get("#interviews").contains("Interviews");
  });
  it("Check Interviews menu context", () => {
    cy.get(".dropdown")
      .eq(3)
      .children()
      .should("have.length", 2)
      .contains("Interviews");
    cy.get(".dropdown")
      .eq(3)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);
        cy.get(".dropdown-content")
          .within(() => {
            cy.log("Check View Interviews page URL");
            cy.get(`[href="/viewinterviews"]`).contains("View Interviews");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/viewinterviews`
            //);
          })
          .within(() => {
            cy.log("Check Create Interview page URL");
            cy.get(`[href="/createinterview"]`).contains("Create Interview");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/createinterview`
            //);
          });
      });
  });

  it("Check Job Openings button exists", () => {
    cy.get("#jobs").contains("Job Openings");
  });
  it("Check Job Openings menu context", () => {
    cy.get(".dropdown")
      .eq(4)
      .children()
      .should("have.length", 2)
      .contains("Job Openings");
    cy.get(".dropdown")
      .eq(4)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);
        cy.get(".dropdown-content")
          .within(() => {
            cy.log("Check View Jobs page URL");
            cy.get(`[href="/viewjobs"]`).contains("View Jobs");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/viewjobs`
            //);
          })
          .within(() => {
            cy.log("Check Create Jobs page URL");
            cy.get(`[href="/createjob"]`).contains("Create Jobs");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/createjob`
            //);
          });
      });
  });

  it("Check Role button exists", () => {
    cy.get("#role").contains("Role");
  });
  it("Check Role menu context", () => {
    cy.get(".dropdown")
      .eq(5)
      .children()
      .should("have.length", 2)
      .contains("Role");
    cy.get(".dropdown")
      .eq(5)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 2);
        cy.get(".dropdown-content")
          .within(() => {
            cy.log("Check View Roles page URL");
            cy.get(`[href="/viewroles"]`).contains("View Roles");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/viewroles`
            //);
          })
          .within(() => {
            cy.log("Check Create Role page URL");
            cy.get(`[href="/createrole"]`).contains("Create Role");
            //  .click({ force: true });
            //cy.url().should(
            //  "be.equal",
            //  `${Cypress.config("baseUrl")}/createrole`
            //);
          });
      });
  });

  it("Check Users button exists", () => {
    cy.get("#users").contains("Users");
  });
  it("Check Users menu context", () => {
    cy.get(".dropdown")
      .eq(6)
      .children()
      .should("have.length", 2)
      .contains("Users");
    cy.get(".dropdown")
      .eq(6)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 1);
        cy.get(".dropdown-content").within(() => {
          cy.log("Check Users page URL");
          cy.get(`[href="/viewusers"]`).contains("Manage Users");
          //  .click({ force: true });
          //cy.url().should("be.equal", `${Cypress.config("baseUrl")}/viewusers`);
        });
      });
  });

  it("Check Profile button exists", () => {
    cy.get("#profile").contains("Profile");
  });
  it("Check Profile menu context", () => {
    cy.get(".dropdown")
      .eq(7)
      .children()
      .should("have.length", 2)
      .contains("Profile");
    cy.get(".dropdown")
      .eq(7)
      .within(() => {
        cy.get(".dropdown-content").children().should("have.length", 5); // +3 br
        cy.get(".dropdown-content")
          .within(() => {
            cy.log("Check User info page URL");
            cy.get(`[href="/profile"]`).contains("User info");
            //  .click({ force: true });
            //cy.url().should("be.equal", `${Cypress.config("baseUrl")}/profile`);
          })
          .within(() => {
            cy.log("Check Logout exists");
            cy.get("#logout").should("exist").contains("Logout");
          });
      });
  });

  it("Check home page context", () => {
    cy.get("section .container-fluid").should("exist");
    cy.get(".container-fluid p").contains("Welcome, ");
  });
});
