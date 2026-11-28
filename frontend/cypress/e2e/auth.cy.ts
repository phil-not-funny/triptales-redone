describe("Login", () => {
  beforeEach(() => cy.visitHydrated("/landing/login"));

  it("logs in with valid credentials and logs out again", () => {
    cy.get("input[name=username]").type("admin");
    cy.get("input[name=password]").type("admin");
    cy.contains("button", "Submit").click();

    cy.contains("Login successful!").should("be.visible");
    cy.location("pathname").should("eq", "/");
    cy.contains("@admin").should("be.visible");
    cy.getCookie("token").should("exist");

    cy.contains("a", "Logout").click();
    cy.location("pathname").should("eq", "/landing");
    cy.getCookie("token").should("not.exist");
  });

  it("rejects a wrong password", () => {
    cy.get("input[name=username]").type("admin");
    cy.get("input[name=password]").type("wrong-password");
    cy.contains("button", "Submit").click();

    cy.contains(
      "The given password and username combination does not exist.",
    ).should("be.visible");
    cy.location("pathname").should("eq", "/landing/login");
    cy.getCookie("token").should("not.exist");
  });

  it("validates the form before sending it", () => {
    cy.contains("button", "Submit").click();
    cy.contains("Username is required").should("be.visible");
    cy.contains("Password is required.").should("be.visible");

    cy.get("input[name=username]").type("Admin");
    cy.contains(
      "Username can only contain lowercase letters, numbers, dots, and underscores.",
    ).should("be.visible");
  });
});
