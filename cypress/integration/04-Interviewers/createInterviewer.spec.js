/// <reference types="Cypress" />

let user = {};

describe("createInterviewer mocked server", () => {
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

    cy.visit("/createinterviewer");
  });

  it("directed to create interviewer page, with form", () => {
    cy.contains("Create Interviewer");
    cy.focused().should("have.id", "firstName");
    cy.contains("First Name");
    cy.contains("Last Name");
    cy.contains("Location");
    cy.contains("Contact #");
    cy.contains("E-mail");
    cy.contains("Total Experience (in years)");
    cy.contains("Current Project");
    cy.contains("Interview Skills");
    cy.get("#int-save-btn").should("be.visible");
    cy.get("#int-reset-btn").should("be.visible");
  });

  it("when form is filled out correctly it submits", () => {
    //stubbed post route
    cy.intercept(
      {
        method: "POST",
        url: "/interviewer",
      },
      { statusCode: 201 }
    ).as("createInterviewer");

    //accepts inputs
    cy.get("#firstName").type("Maria").should("have.value", "Maria");
    cy.get("#lastName").type("Garcia").should("have.value", "Garcia");
    cy.get("#location").type("USA").should("have.value", "USA");
    cy.get("#phoneNumber")
      .type("5105556666")
      .should("have.value", "5105556666");
    cy.get("#email")
      .type("test@test.com")
      .should("have.value", "test@test.com");
    cy.get("#totalExperience").type("10").should("have.value", "10");
    cy.get("#currentProject").type("RCP").should("have.value", "RCP");
    cy.get("#interviewSkills")
      .type("Technical")
      .should("have.value", "Technical");

    cy.get('[type="submit"]').click();
    cy.get("input:valid").should("have.length", 8);
    cy.get('div[class="error-message"]').should("be.empty");

    cy.wait("@createInterviewer").then((interception) => {
      assert.isNotNull(interception.response.body);
      console.log(interception);
    });

    cy.get("@createInterviewer").then((int) => {
      expect(int.request.body.full_name).to.equal("Maria Garcia");
      expect(int.response.statusCode).to.equal(201);
      expect(int.response.body).to.equal("");
    });

    //close success modal
    cy.contains("Interviewer saved successfully!");
    cy.get(".modalBtn").click();
  });

  it("reset button clears form inputs", () => {
    cy.get("#firstName").type("Maria");
    cy.get("#lastName").type("Garcia");
    cy.get("#location").type("USA");
    cy.get("#phoneNumber").type("5105556666");
    cy.get("#email").type("test@test.com");
    cy.get("#totalExperience").type("10");
    cy.get("#currentProject").type("RCP");
    cy.get("#interviewSkills").type("Technical");

    cy.get('[type="reset"]').click();

    cy.get("#firstName").should("have.value", "");
    cy.get("#lastName").should("have.value", "");
    cy.get("#location").should("have.value", "");
    cy.get("#phoneNumber").should("have.value", "");
    cy.get("#email").should("have.value", "");
    cy.get("#totalExperience").should("have.value", "");
    cy.get("#currentProject").should("have.value", "");
    cy.get("#interviewSkills").should("have.value", "");
  });

  describe("all required inputs need values to submit form", () => {
    it("if all fields empty, shows warning", () => {
      cy.get('[type="submit"]').click();
      cy.get('div[class="error-message"]').contains(
        "Please fill out all required fields"
      );
    });

    it("only first name filled out, warning shows", () => {
      cy.get("#firstName").type("Maria");
      cy.get("#phoneNumber").type("5105556666");
      cy.get("#totalExperience").type("10");
      cy.get("#currentProject").type("RCP");
      cy.get("#interviewSkills").type("Technical");
      cy.get('[type="submit"]').click();
      cy.get('div[class="error-message"]').contains(
        "Please fill out all required fields"
      );
      cy.get('[type="reset"]').click();
    });

    it("only first and last name filled, warning", () => {
      cy.get("#firstName").type("Maria");
      cy.get("#lastName").type("Garcia");
      cy.get("#phoneNumber").type("5105556666");
      cy.get("#totalExperience").type("10");
      cy.get("#currentProject").type("RCP");
      cy.get("#interviewSkills").type("Technical");
      cy.get('[type="submit"]').click();
      cy.get('div[class="error-message"]').contains(
        "Please fill out all required fields"
      );
      cy.get('[type="reset"]').click();
    });

    it("only first and last name, location filled, warning", () => {
      cy.get("#firstName").type("Maria");
      cy.get("#lastName").type("Garcia");
      cy.get("#location").type("USA");
      cy.get("#phoneNumber").type("5105556666");
      cy.get("#totalExperience").type("10");
      cy.get("#currentProject").type("RCP");
      cy.get("#interviewSkills").type("Technical");
      cy.get('[type="submit"]').click();
      cy.get('div[class="error-message"]').contains(
        "Please fill out all required fields"
      );
      cy.get('[type="reset"]').click();
    });

    it("only first, location and email filled, warning", () => {
      cy.get("#firstName").type("Maria");
      cy.get("#location").type("USA");
      cy.get("#email").type("test@test.com");
      cy.get("#phoneNumber").type("5105556666");
      cy.get("#totalExperience").type("10");
      cy.get("#currentProject").type("RCP");
      cy.get("#interviewSkills").type("Technical");
      cy.get('[type="submit"]').click();
      cy.get('div[class="error-message"]').contains(
        "Please fill out all required fields"
      );
      cy.get('[type="reset"]').click();
    });
  });

  describe("input validation", () => {
    it("first name can only contain letters", () => {
      cy.get("#firstName").type("33");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      // cy.get("#firstName").then(($input) => {
      //   expect($input[0].validationMessage).to.contain(
      //     "Input can only contain letters"
      //   );
      // });
      cy.get('[type="reset"]').click();
    });

    it("first name accepts max 20 characters", () => {
      cy.get("#firstName")
        .type("abcdefghijklmnopqrstuvwxyz")
        .should("have.value", "abcdefghijklmnopqrst")
        .and("not.have.value", "abcdefghijklmnopqrstuvwxyz");
      cy.get('[type="reset"]').click();
    });
    it("last name can only contain letters", () => {
      cy.get("#lastName").type("555");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      // cy.get("#lastName").then(($input) => {
      //   expect($input[0].validationMessage).to.contain(
      //     "Input can only contain letters."
      //   );
      // });
      cy.get('[type="reset"]').click();
    });

    it("last name accepts max 20 characters", () => {
      cy.get("#lastName")
        .type("abcdefghijklmnopqrstuvwxyz")
        .should("have.value", "abcdefghijklmnopqrst")
        .and("not.have.value", "abcdefghijklmnopqrstuvwxyz");
      cy.get('[type="reset"]').click();
    });

    it("location accepts max 20 characters", () => {
      cy.get("#location")
        .type("abcdefghijklmnopqrstuvwxyz")
        .should("have.value", "abcdefghijklmnopqrst")
        .and("not.have.value", "abcdefghijklmnopqrstuvwxyz");
      cy.get('[type="reset"]').click();
    });

    it("phone number only accepts numbers", () => {
      cy.get("#phoneNumber").type("555aaa45bb");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      // cy.get("#phoneNumber").then(($input) => {
      //   expect($input[0].validationMessage).to.contain(
      //     "Input can only accept numbers."
      //   );
      // });
      cy.get('[type="reset"]').click();
    });

    it("phone number accepts max 14 characters", () => {
      cy.get("#phoneNumber")
        .type("12345678910111213")
        .should("have.value", "12345678910111")
        .and("not.have.value", "12345678910111213");
      cy.get('[type="reset"]').click();
    });

    it("email must be in correct format", () => {
      cy.get("#email").type("username");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get('[type="reset"]').click();

      cy.get("#email").type("username@");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get('[type="reset"]').click();

      cy.get("#email").type("username@test");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get('[type="reset"]').click();

      cy.get("#email").type("username@test.");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 1);
      cy.get('[type="reset"]').click();

      cy.get("#email").type("username@test.com");
      cy.get('[type="submit"]').click();
      cy.get("input:invalid").should("have.length", 0);
      cy.get('[type="reset"]').click();

      //error message varies depending on browser
      // cy.get("#email").then(($input) => {
      //   expect($input[0].validationMessage).to.eq(
      //     "Please enter an email address."
      //   );
      // });
    });

    it("experience only accepts numbers", () => {
      cy.get("#totalExperience").type("2A");
      cy.get("#totalExperience").should("have.value", "2");
      cy.get('[type="reset"]').click();
    });

    it("current project accepts max 30 characters", () => {
      cy.get("#currentProject")
        .type("This is 30 characters exactly! xxxx")
        .should("have.value", "This is 30 characters exactly!")
        .and("not.have.value", "This is 30 characters exactly! xxxx");
      cy.get('[type="reset"]').click();
    });
  });
});
