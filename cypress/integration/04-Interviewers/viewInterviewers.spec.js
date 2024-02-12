/// <reference types="Cypress" />

let user = {};

describe("viewInterviewer test suite with mock data, admin user", () => {
  //login user
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

  it("axios.get is successful, table populates with data, component renders correctly", () => {
    cy.get(".int-header").should("exist").contains("Interviewers List");
    cy.get(".interviewerTable").should("exist");
    cy.get("thead").should("exist").contains("Name");
    cy.get("thead").contains("Email");
    cy.get("thead").contains("Contact #");
    cy.get("thead").contains("Location");
    cy.get("thead").contains("Interview Skills");
    cy.get("thead").contains("Experience (years)");
    cy.get("thead").contains("Current Project");
    cy.get("thead").contains("edit");
    cy.get("thead").then(() => {
      cy.get(".int-delete").should("be.disabled");
    });

    cy.get("tr").should("have.length", 3);
    cy.get("th").should("have.length", 9);
    cy.get("td").should("have.length", 18);

    cy.get(".int-name").eq(0).contains("John Doe");
    cy.get(".int-name").eq(1).contains("Jane Doe");
  });

  describe("edit and modal functionality", () => {
    it("modal loads with form and buttons", () => {
      cy.get(".editBtn")
        .eq(0)
        .invoke("attr", "id")
        .then((id) => {
          const intId = id;
          cy.wrap(intId).as("intId");
        });

      //mock response data to populate fields
      cy.get("@intId").then((id) => {
        cy.intercept(
          { method: "GET", url: `/interviewer/${id}` },
          {
            body: {
              id: `${id}`,
              full_name: "John Doe",
              location: "USA",
              phone_no: "+1(000) 000-0000",
              email: "test@test.com",
              interview_skills: "testing",
              current_project: "gap",
              total_experience: 3,
            },
          }
        ).as("editInterviewer");
      });

      cy.get("@intId").then((id) => {
        cy.get(`[id=${id}]`).click();
      });

      cy.wait("@editInterviewer");

      cy.get(".intModal").should("exist");
      cy.get(".edit-modal-header").should("include.html", "button");
      cy.get(".edit-modal-header").should("include.html", "h2");
      cy.get("h2").contains("Edit Interviewer");
      cy.get(".close-btn").should("exist");
      cy.get(".save-edit-btn").contains(/save/i);

      cy.get(".intModalForm").contains("Full Name");
      cy.get(".intModalForm").contains("Email");
      cy.get(".intModalForm").contains("Contact #");
      cy.get(".intModalForm").contains("Location");
      cy.get(".intModalForm").contains("Interview Skills");
      cy.get(".intModalForm").contains("Work Experience (in years)");
      cy.get(".intModalForm").contains("Current Project");

      cy.get(".close-btn").click();
    });

    it("mocked successful patch request", () => {
      cy.get(".editBtn")
        .eq(0)
        .invoke("attr", "id")
        .then((id) => {
          const intId = id;
          cy.wrap(intId).as("intId");
        });

      //mock response data to populate fields
      cy.get("@intId").then((id) => {
        cy.intercept(
          { method: "GET", url: `/interviewer/${id}` },
          {
            body: {
              id: `${id}`,
              full_name: "John Doe",
              location: "USA",
              phone_no: "+1(000) 000-0000",
              email: "test@test.com",
              interview_skills: "testing",
              current_project: "gap",
              total_experience: 3,
            },
          }
        ).as("editInterviewer");
      });

      cy.get("@intId").then((id) => {
        cy.get(`[id=${id}]`).click();
      });

      cy.wait("@editInterviewer");

      cy.get("#full_name").clear();
      cy.get("#full_name")
        .type("John Smith")
        .should("have.value", "John Smith");
      cy.get("#location").clear();
      cy.get("#location").type("Oakland").should("have.value", "Oakland");

      cy.get("@intId").then((id) => {
        cy.intercept(
          { method: "PATCH", url: `/interviewer/${id}` },
          { statusCode: 200 }
        ).as("patch");
      });

      cy.get(".save-edit-btn").click();

      cy.wait("@patch")
        .its("request.body")
        .should("include", { full_name: "John Smith", location: "Oakland" });
      cy.url().should(
        "include",
        "viewinterviewers?full_name=John+Smith&email=test%40test.com&phone_no=%2B1%28000%29+000-0000&location=Oakland&interview_skills=testing&total_experience=3&current_project=gap"
      );
    });

    it("close button closes modal", () => {
      cy.get(".editBtn")
        .eq(0)
        .invoke("attr", "id")
        .then((id) => {
          const intId = id;
          cy.wrap(intId).as("intId");
        });

      //mock response data to populate fields
      cy.get("@intId").then((id) => {
        cy.intercept(
          { method: "GET", url: `/interviewer/${id}` },
          {
            statusCode: 200,
            body: {
              id: `${id}`,
            },
          }
        ).as("editInterviewer");
      });

      cy.get("@intId").then((id) => {
        cy.get(`[id=${id}]`).click();
      });

      cy.wait("@editInterviewer");
      cy.get(".close-btn").click();
      cy.get(".intModal").should("not.exist");
    });

    describe("input validation/limits", () => {
      it("input needs to be in correct format", () => {
        cy.get(".editBtn")
          .eq(0)
          .invoke("attr", "id")
          .then((id) => {
            const intId = id;
            cy.wrap(intId).as("intId");
          });
        cy.get("@intId").then((id) => {
          cy.intercept(
            { method: "GET", url: `/interviewer/${id}` },
            { statusCode: 200, body: { id: `${id}` } }
          ).as("editInterviewer");
        });
        cy.get("@intId").then((id) => {
          cy.get(`[id=${id}]`).click();
        });
        cy.wait("@editInterviewer");

        cy.get("#full_name").type("33333");
        cy.get(".save-edit-btn").click();
        cy.get("input:invalid").should("have.length", 1);
        cy.get("#full_name").clear();

        cy.get("#email").type("test@t");
        cy.get(".save-edit-btn").click();
        cy.get("input:invalid").should("have.length", 1);
        cy.get("#email").clear();

        cy.get("#phone_no").type("num");
        cy.get(".save-edit-btn").click();
        cy.get("input:invalid").should("have.length", 1);
        cy.get("#phone_no").clear();

        cy.get("#total_experience").type("num");
        cy.get("#total_experience").should("have.value", "");
      });
    });
  });

  describe("delete functionality", () => {
    it("successful delete request of one interviewer", () => {
      cy.get(".int-delete").should("be.disabled");
      cy.get("tr").should("have.length", 3);
      cy.get(".int-name").eq(0).should("have.text", "John Doe");

      cy.get('[type="checkbox"]').eq(0).click();
      cy.get(".int-delete").should("be.enabled");

      cy.intercept(
        { method: "DELETE", url: "interviewer/1" },
        { statusCode: 200 }
      ).as("delete");

      cy.get(".int-delete").click();
      cy.wait("@delete");

      cy.get("tr").should("have.length", 2);
      cy.get(".int-name").eq(0).should("have.text", "Jane Doe");
      cy.contains("John Doe").should("not.exist");
    });
  });

  //mocked get, no data
  it("table is empty if there is no interviewers data", () => {
    cy.intercept(
      { method: "GET", url: "/interviewer" },
      { status: 200, body: [] }
    ).as("loadInterviewers");

    cy.visit("/viewinterviewers");
    cy.wait("@loadInterviewers");
    cy.get("tr").should("have.length", 1);
    cy.get("th").should("have.length", 9);
    cy.get("td").should("have.length", 0);
  });
});
