describe("Search", () => {
  it("finds a user and opens the profile", () => {
    cy.visitHydrated("/search");
    cy.get("input[type=search]").type("admin");

    cy.location("search").should("eq", "?q=admin");
    cy.contains("a", "@admin").click();
    cy.location("pathname").should("eq", "/user/admin");
  });

  it("finds a post", () => {
    cy.visitHydrated("/search");
    cy.get("input[type=search]").type("Salzburg");
    cy.contains("Test trip to Salzburg").should("be.visible");
  });

  it("restores the search from the URL", () => {
    cy.visitHydrated("/search?q=admin");
    cy.get("input[type=search]").should("have.value", "admin");
    cy.contains("a", "@admin").should("be.visible");
  });

  it("tells when nothing matches", () => {
    cy.visitHydrated("/search");
    cy.get("input[type=search]").type("xyznomatch");
    cy.contains('No results for "xyznomatch".').should("be.visible");
  });
});
