

describe('Home page visit', () =>
{
  it('Visit The Home Page', () => {
    cy.visit('/')
    cy.clearCookies('log:true')
    cy.get('h1').should('contain', 'Home')
    cy.get('[data-test-id-nav]').children().children().should('contain', 'About').and('contain', 'Signup').and('contain', 'Login')

  })
})
