// set of steps for login
Cypress.Commands.add("login", (user) => {
  cy.visit("/");
  cy.get("#name").type(user.name).should("have.value", user.name);
  cy.get("#password").type(user.pass).should("have.value", user.pass);

  // stub POST user
  cy.intercept(
    { method: "POST", url: "/authenticate" },
    { statusCode: 200 }
  ).as("login");
  // stub GET current user info (request inside login while authenticating)
  cy.intercept(
    { method: "GET", url: "/users/current" },
    { statusCode: 200, body: {roles : user.roles}}
  ).as("login");

  cy.get("#login").click();

  cy.wait("@login").then(() => {
    window.sessionStorage.setItem("userInfo", JSON.stringify(user));
  });
});
