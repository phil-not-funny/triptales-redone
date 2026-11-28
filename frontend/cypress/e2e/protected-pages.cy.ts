describe("Protected pages", () => {
  ["/settings", "/post/new"].forEach((path) => {
    it(`asks for a login on ${path} when logged out`, () => {
      cy.visitHydrated(path);
      cy.contains("Please Log In to Continue").should("be.visible");
    });
  });

  it("shows the settings when logged in", () => {
    cy.login();
    cy.visitHydrated("/settings");
    cy.contains("h1", "Settings").should("be.visible");
    cy.contains("Please Log In to Continue").should("not.exist");
  });
});
