it('visits the index', () => {
  cy.visit('/').getByText('Welcome');
});
