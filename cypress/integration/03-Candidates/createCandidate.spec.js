/// <reference types="Cypress" />

let user = {};

describe("create candidate as admin", () => {
  before(() => {
    cy.window()
      .then((win) => {
        win.sessionStorage.clear();
      })
      .then(() => {
        cy.fixture("testAdmin").then((testAdmin) => {
          user = testAdmin;
          cy.login(user);
        });
      });
  });

  beforeEach(() => {
    cy.intercept(
      { method: "GET", url: "/users/role?roleName=RECRUITER" },
      { fixture: "userRoles.json" }
    ).as("loadrecruiters");

    cy.visit("/createcandidate");
    cy.wait("@loadrecruiters");
  });

  it("directed to create candidate page w/ form", () => {
    cy.get(".create-heading").should("have.text", "Create Candidate");
    cy.get(".create-cand-rec-select").should("exist");
    cy.get("#candidateSubmit").should("exist");
    cy.get("[type='submit']").should("exist");
    cy.get("[type='reset']").should("exist");
  });

  it("recruiter drop down populates with recruiters", () => {
    cy.get("#recruiter")
      .select("Test One")
      .select("Test Two")
      .select("Test Three");
  });

  it("submits when required fields have values", () => {
    cy.intercept(
      {
        method: "POST",
        url: "/candidates",
      },
      { statusCode: 201 }
    ).as("create");

    cy.get("#firstName").type("John");
    cy.get("#email").type("test@test.com");
    cy.get("#country").type("USA");
    cy.get("#gender").select("Female");
    cy.get("#workAuthStatus").select("Green Card");

    cy.get("[type='submit']").click();

    cy.wait("@create").then((interception) => {
      assert.isNotNull(interception.response.body);
      console.log(interception);
    });

    cy.get("@create").then((int) => {
      expect(int.request.body.firstName).to.equal("John");
      expect(int.request.body.email).to.equal("test@test.com");
      expect(int.request.body.address.country).to.equal("USA");
      expect(int.request.body.gender).to.equal("Female");
      expect(int.request.body.workAuthStatus).to.equal("Green Card");
    });

    cy.get(".modalBtn").click();
  });

  it("form has required text input fields", () => {
    cy.get("[type='submit']").click();
    cy.get("input:invalid").should("have.length", 3);
    cy.get("#firstName").then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
    cy.get("#firstName").type("John");
    cy.get("input:invalid").should("have.length", 2);
    cy.get("#email").then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
    cy.get("#email").type("test@test.com");
    cy.get("input:invalid").should("have.length", 1);
    cy.get("#country").then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
    cy.get("#country").type("USA");
    cy.get("input:invalid").should("have.length", 0);
    cy.get("[type='reset']").click();
  });

  it("form as required selects", () => {
    cy.get("#firstName").type("John");
    cy.get("#email").type("test@test.com");
    cy.get("#country").type("USA");
    cy.get("[type='submit']").click();
    cy.get("#gender").then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
    cy.get("#gender").select("Female");
    cy.get("[type='submit']").click();
    cy.get("#workAuthStatus").then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
    cy.get("[type='reset']").click();
  });

  describe("input field validation", () => {
    it("first name only accepts letters", () => {
      cy.get("#firstName").type("1").should("have.value", "");
    });

    it("last name only accepts letters", () => {
      cy.get("#lastName").type("1").should("have.value", "");
    });

    it("email has to be in correct format", () => {
      cy.intercept(
        {
          method: "POST",
          url: "/candidates",
        },
        { statusCode: 201 }
      ).as("create");

      cy.get("#firstName").type("John");
      cy.get("#country").type("USA");
      cy.get("#gender").select("Female");
      cy.get("#workAuthStatus").select("Green Card");
      cy.get("#email").type("example");
      cy.get("[type='submit']").click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get("#email").then(($input) => {
        expect($input[0].validationMessage).to.exist;
      });
      cy.get("#email").clear();
      cy.get("#email").type("example@");
      cy.get("[type='submit']").click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get("#email").then(($input) => {
        expect($input[0].validationMessage).to.exist;
      });
      cy.get("#email").clear();
      cy.get("#email").type("example@example");
      cy.get("[type='submit']").click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get("#email").then(($input) => {
        expect($input[0].validationMessage).to.exist;
      });
      cy.get("#email").clear();
      cy.get("#email").type("example@example.");
      cy.get("[type='submit']").click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get("#email").then(($input) => {
        expect($input[0].validationMessage).to.exist;
      });
      cy.get("#email").clear();
      cy.get("#email").type("example@example.com");

      cy.get("[type='submit']").click();
      cy.wait("@create");

      cy.get(".modalBtn").click();
    });

    it("phone number only accepts numbers, reformats when correct length reached", () => {
      cy.get("#phoneNumber").type("a").should("have.value", "");
      cy.get("#phoneNumber")
        .type("0000000000")
        .should("have.value", "+1(000) 000-0000");
    });

    it("total experience only accepts numbers", () => {
      cy.get("#totalExperience").type("a").should("have.value", "");
    });

    it("relevant experience only accepts numbers", () => {
      cy.get("#relevantExperience").type("a").should("have.value", "");
    });

    it("curr ctc val only accepts numbers", () => {
      cy.get("#cCTCVal").type("a").should("have.value", "");
    });

    it("exp ctc val only accepts numbers", () => {
      cy.get("#eCTCVal").type("a").should("have.value", "");
    });
  });
});
