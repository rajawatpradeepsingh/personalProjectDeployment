/// <reference types="Cypress" />

let user = {};

describe("view candidates as admin user", () => {
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

     cy.intercept(
       {
         method: "GET",
         url: "/candidates?recruiterid=all&pageNo=0&pageSize=10",
       },
       { fixture: "candidates.json" }
     ).as("loadCand");

     cy.visit("/viewcandidates");
     cy.wait("@loadrecruiters");
     cy.wait("@loadCand");
   });

   it("directed to view cand page with table", () => {
      cy.contains("Candidates");
   })
})