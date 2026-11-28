describe("Sign up", () => {
  beforeEach(() => cy.visitHydrated("/landing/signup"));

  it("registers a new account that can log in afterwards", () => {
    const username = `cy_${Date.now()}`;
    const password = "Cypress!123";

    cy.get("input[name=username]").type(username);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(password);
    cy.get("input[name=email]").type(`${username}@example.com`);
    cy.get("input[name=displayName]").type("Cypress Tester");
    cy.contains("button", "Create new Account").click();

    cy.contains("Account created successfully!").should("be.visible");
    cy.location("pathname").should("eq", "/landing/login");
    cy.get("input[name=confirmPassword]").should("not.exist");

    cy.get("input[name=username]").type(username);
    cy.get("input[name=password]").type(password);
    cy.contains("button", "Submit").click();

    cy.location("pathname").should("eq", "/");
    cy.contains(`@${username}`).should("be.visible");
  });

  it("rejects mismatching passwords", () => {
    cy.get("input[name=username]").type("cy_mismatch");
    cy.get("input[name=password]").type("Cypress!123");
    cy.get("input[name=confirmPassword]").type("Cypress!124");
    cy.get("input[name=email]").type("cy_mismatch@example.com");
    cy.get("input[name=displayName]").type("Mismatch");
    cy.contains("button", "Create new Account").click();

    cy.contains("The passwords do not match").should("be.visible");
    cy.location("pathname").should("eq", "/landing/signup");
  });
});
