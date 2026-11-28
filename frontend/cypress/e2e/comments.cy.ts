describe("Comments", () => {
  beforeEach(() => {
    cy.findPostGuid("Salzburg").as("guid");
  });

  it("lets a logged in user comment on a post", function () {
    const text = `Cypress comment ${Date.now()}`;
    cy.login();
    cy.visitHydrated(`/post/${this.guid}`);

    cy.get("textarea[placeholder='Write a comment...']").type(text);
    cy.contains("button", "Post Comment").click();
    cy.contains(text).should("be.visible");

    cy.reload();
    cy.contains(text).should("be.visible");
  });

  it("hides the comment form when logged out", function () {
    cy.visitHydrated(`/post/${this.guid}`);
    cy.contains("Comments").should("be.visible");
    cy.get("textarea[placeholder='Write a comment...']").should("not.exist");
  });
});
