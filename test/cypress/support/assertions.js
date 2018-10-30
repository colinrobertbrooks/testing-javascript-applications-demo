/*
  url
*/
Cypress.Commands.add('assertUrl', route =>
  cy.url().should('equal', `${window.location.origin}${route}`)
);

/*
  cypress testing library
*/
Cypress.Commands.add('getLinkByText', textMatch =>
  cy.getByText(
    (content, element) => content === textMatch && /a/i.test(element.tagName)
  )
);

Cypress.Commands.add('queryLinkByText', (textMatch, options = {}) =>
  cy.queryByText(
    (content, element) => content === textMatch && /a/i.test(element.tagName),
    options
  )
);

/*
  bootstrap
*/
Cypress.Commands.add(
  'isActive',
  {
    prevSubject: 'element'
  },
  subject => expect(subject).to.have.class('active')
);

Cypress.Commands.add(
  'isAlertWithSuccess',
  {
    prevSubject: 'element'
  },
  subject => expect(subject).to.have.class('alert-success')
);

Cypress.Commands.add(
  'isAlertWithDanger',
  {
    prevSubject: 'element'
  },
  subject => expect(subject).to.have.class('alert-danger')
);

Cypress.Commands.add(
  'isAlertWithWarning',
  {
    prevSubject: 'element'
  },
  subject => expect(subject).to.have.class('alert-warning')
);
