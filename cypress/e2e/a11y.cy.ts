import "cypress-axe";

const locales = ["/", "/es/", "/fr/"];

describe("accessibility", () => {
  locales.forEach((locale) => {
    const label = locale === "/" ? "en" : locale.replace(/\//g, "");
    it(`home page (${label}) is accessible`, () => {
      cy.visit(locale);
      cy.injectAxe();
      cy.checkA11y();
    });
  });
});
