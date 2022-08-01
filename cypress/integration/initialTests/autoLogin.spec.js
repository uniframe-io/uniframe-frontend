/// <reference types="cypress" />
  const apiUrl = 'http://com-s-lbA35-14Q9C4M0FXI6L-1467455468.eu-west-1.elb.amazonaws.com:8000/api/v1';

  describe('Login Proccess', () =>
  {
    it('successful Auto login', () =>
    {
      //setting up token
    console.log(Cypress.env('apiUrl'))
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`, // baseUrl is prepended to url
        form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
        body: {
        username: 'test@dataset.com',
        password: '123456',
  }
      }).then(({ body }) =>
      {
        let userName = body.user.full_name.split(' ', 1)[0]
        cy.setCookie('Authorization', `${ body.access_token }`);
        //Auto login test
        cy.visit('/')
        cy.get('[data-test-id-nav]').children().children().should('contain', 'About').and('contain', 'Dashboard').and('contain', 'Logout');
        cy.visit('/')
        cy.get('[data-test-id-welcome-message]').should('contain', `${userName}`)
      }
      )
    }
    )
  })


