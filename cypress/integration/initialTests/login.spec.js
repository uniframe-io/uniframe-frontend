
/// <reference types="cypress" />

describe('Login Proccess', () =>
{
  it('successfully loads login page', () =>
  {
    cy.visit('/'); // change URL to match your dev URL
    cy.clearCookies('log:true')
    cy.get('h1').should('contain', 'Home')
    cy.get('[data-test-id-nav]').children('ul').children('li').children('a[href*="/signIn"]').should('contain', 'Login').click()
    cy.url().should('contain', 'signIn')
    cy.get('[data-test-id-nav]').children('ul').children('li').as('navbar').not('contain', 'Dashboard')
    cy.get('[data-test-id-email]').should('have.attr', 'type', 'email').and('have.attr', 'placeholder', 'youremail@exaple.com').as('email')
    cy.get('@email').type('test@dataset.com')
    cy.get('[data-test-id-password]').should('have.attr', 'type', 'password').and('have.attr', 'placeholder', 'password').as('password')
    cy.get('@password').type('123456{enter}')
    cy.get('h1').should('contain', 'Dashboard')
    cy.get('@navbar').should('contain','Dashboard').and('contain','Logout').not('contain','Login')
    cy.getCookie('Authorization', 'log:true').then(({value}) => {
    // cookie is an object with "domain", "name" and other properties
      cy.log(value)
  })
    
  })

  
})
