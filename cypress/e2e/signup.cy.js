/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Signup and Login Test', () => {
  const randomString = Math.random().toString(36).substring(2)
  //   const username = 'Auto' + randomString
  const email = 'Auto_email' + randomString + '@gmail.com'
  const password = 'Password1'
  const answer = 'kebo'

  describe('UI Test', () => {
    beforeEach(() => {
      cy.log('email: ' + email)
      cy.log('password: ' + password)
      cy.visit('http://localhost:3000/')
      cy.get('.close-dialog').click()
      cy.get('.cc-btn').click()
      cy.get('#navbarAccount').contains('Account').click().then(() => {
        cy.get('#navbarLoginButton').contains('Login').click()
      })
      cy.wait(2000)
    })

    it('Test Valid Signup', () => {
      cy.get('#newCustomerLink').click()
      cy.get('#emailControl').type(email)
      cy.get('#passwordControl').type(password)
      cy.get('#repeatPasswordControl').type(password)

      cy.get('#mat-select-value-3').click()
      cy.get('#mat-select-2-panel').contains('Name of your favorite pet?').click()

      cy.get('#securityAnswerControl').type(answer)
      cy.get('#registerButton').contains('Register').click()
      cy.get('.mat-snack-bar-container').contains('Registration completed successfully.')
    })

    it('Test Valid Login', () => {
      cy.get('#email').type(email)
      cy.get('#password').type(password)
      cy.get('#loginButton').contains('Log in').click()
      cy.get('#navbarAccount').contains('Account').click().then(() => {
        cy.get('#mat-menu-panel-0').contains(email)
      })
      cy.get('.fa-layers-counter').contains(0)
    })
  })

  describe('API Test', () => {
    const userCredentials = {
      email: email,
      password: password
    }
    it('Test Login via API (Non UI)', () => {
      cy.request('POST', 'http://localhost:3000/rest/user/login', userCredentials)
        .then(response => {
          expect(response.status).to.eq(200)
          expect(response.body.authentication.umail).to.eql(email)
        })
    })

    it('Login via Token (Non UI)', () => {
      cy.request('POST', 'http://localhost:3000/rest/user/login', userCredentials)
        .its('body').then(body => {
          const token = body.authentication.token
          cy.wrap(token).as('userToken')

          const userToken = cy.get('@userToken')
          cy.visit('http://localhost:3000/', {
            onBeforeLoad (browser) {
              browser.localStorage.setItem('token', userToken)
            }
          })
          cy.wait(2000)
          cy.get('.cdk-overlay-backdrop').click(-50, -50, { force: true })
          cy.get('.fa-layers-counter').contains(0)
        })
    })
  })
})
