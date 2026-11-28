import { API_URL } from "../../lib/config";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      visitHydrated(url: string): Chainable<void>;
      login(username?: string, password?: string): Chainable<void>;
      findPostGuid(term: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add("visitHydrated", (url: string) => {
  cy.visit(url);
  cy.document().should((doc) => {
    const controls = [...doc.querySelectorAll("input, button")];
    expect(controls, "interactive elements").to.have.length.greaterThan(0);
    const hydrated = controls.every((el) =>
      Object.keys(el).some((key) => key.startsWith("__reactProps$")),
    );
    expect(hydrated, "page hydrated").to.equal(true);
  });
});

Cypress.Commands.add("login", (username = "admin", password = "admin") => {
  cy.request("POST", `${API_URL}/User/login`, { username, password })
    .its("body.token")
    .then((token: string) => {
      cy.setCookie("token", token);
    });
});

Cypress.Commands.add("findPostGuid", (term: string) =>
  cy
    .request({ url: `${API_URL}/Search`, qs: { query: term } })
    .its("body.posts.0.guid"),
);
