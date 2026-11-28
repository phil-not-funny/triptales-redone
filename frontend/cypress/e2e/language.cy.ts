describe("Language switcher", () => {
  it("switches the UI to German and keeps it after a reload", () => {
    cy.visitHydrated("/search");
    cy.contains("button", "Language:").click();
    cy.contains("button", "Deutsch").click();

    cy.getCookie("locale").should("have.property", "value", "de");
    cy.contains("button", "Sprache:").should("be.visible");
    cy.get("input[type=search]").should(
      "have.attr",
      "placeholder",
      "Nach Benutzern oder Beiträgen suchen …",
    );

    cy.reload();
    cy.contains("button", "Sprache:").should("be.visible");
  });
});
