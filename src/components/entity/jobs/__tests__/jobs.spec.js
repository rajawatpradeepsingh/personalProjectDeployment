const newUser = {
    name: "newUser",
    pass: "newPassword",
    firstName: "newFirstName",
    lastName: "newLastName",
    email: "newemail@email.com",
  };
  
  describe("Home page tests", () => {
    // initial login
    before(() => {
      cy.log("LOGIN");
      cy.visit("/");
  
      cy.get("#name").type(newUser.name).should("have.value", newUser.name);
      cy.get("#password").type(newUser.pass).should("have.value", newUser.pass);
  
      // stubb POST user
      cy.intercept(
        { method: "POST", url: "/users/login" },
        { statusCode: 200 }
      ).as("login");
  
      cy.get("#login").click();
      
  
      cy.wait("@login");
    });
  
    // final logout
    after(() => {
        cy.visit("/");
      cy.get("#logout").click({ force: true });
      cy.log("LOGOUT");
    });
  
  
    it("visit job", () => {
      cy.visit("/Createjob");
  
      cy.get(".job_bottom").click();
  
      cy.url().should("be.equal", `${Cypress.config("baseUrl")}/Createjob`);
  
      cy.get("h1").contains("Job Description").should("exist");
  
      cy.get("div#job-box").contains("Client Name").should("exist");
  
      cy.get("div#job-box").contains("Client Job ID").should("exist");
  
      cy.get("div#job-box").contains("Client Bill Rate / Hr").should("exist");
  
      cy.get("div#job-box").contains("Recruiter Name").should("exist");
  
      cy.get("div#job-box").contains("Job Creation Date").should("exist");
  
      cy.get("div#job-box").contains("Job Title").should("exist");
  
      cy.get("div#job-box").contains("Job Type").should("exist");
  
      cy.get("div#job-box").contains("Work Location").should("exist");
  
      cy.get("div#job-box").contains("FLSA type").should("exist");
  
      cy.get("div#container").should("exist");
  
      cy.get('select#jbtyp').select('Part Time').should('have.value', 'Part Time')
  
      cy.get('select#jbtyp').select('Fulltime').should('have.value', 'Fulltime')
  
      cy.get('select#wrkln').select('On Site').should('have.value', 'On Site')
  
      cy.get('select#wrkln').select('Remote').should('have.value', 'Remote')
  
      cy.get('select#flsatp').select('Exempt').should('have.value', 'Exempt')
  
      cy.get('select#flsatp').select('Non Exempt').should('have.value', 'Non Exempt')
  
      cy.get('select#taxtp').select('C2C').should('have.value', 'C2C')
  
      cy.get('select#taxtp').select('W-2').should('have.value', 'W-2')
  
      cy.get('input#clientName').type('Hello, World')
  
      cy.get('input#clientJobId').type('Hello, World')
  
      cy.get('input#recruiterName').type('Hello, World')
  
      cy.get('input#jobTitle').type('Hello, World')
  
      cy.get('textarea').type('Hello world')
  
      cy.clock(Date.UTC(2018, 10, 30), ['Date'])
      
      cy.get('#jobSubmit').submit()
  
      cy.get('.btn').click()
  
      
  
    });
  
  
    it("visit job", () => {
      cy.visit("/Viewjobs");
  
      cy.get('[type="checkbox"]').check()
  
      cy.get("div#job-box").contains("Client Name").should("exist");
  
      cy.get("div#job-box").contains("Client Job ID").should("exist");
  
      cy.get("div#job-box").contains("Client Bill Rate / Hr").should("exist");
  
      cy.get("div#job-box").contains("Recruiter Name").should("exist");
  
      cy.get("div#job-box").contains("Job Creation Date").should("exist");
  
      cy.get("div#job-box").contains("Job Title").should("exist");
  
      cy.get("div#job-box").contains("Job Type").should("exist");
  
      cy.get("div#job-box").contains("Work Location").should("exist");
  
      cy.get("div#job-box").contains("FLSA type").should("exist");
  
  
    });
  });