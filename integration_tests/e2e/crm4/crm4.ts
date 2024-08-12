import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('the user is on the Historical Data page', () => {
  cy.visit('/')
})

When('the user selects {string} link', linkText => {
  cy.contains(`${linkText}`).click()
})

When('the user selects {string} from the CRM type dropdown and clicks search', crmType => {
  cy.get('#type').select(`${crmType}`)
  cy.get('button[type="submit"]').click()
})

When('the user clicks on a Client name or USN link', () => {
  cy.get('table.govuk-table tbody tr td.govuk-table__cell  a').first().click()
})

Then('it should return a page related to the corresponding CRM4 case', () => {
  cy.url().should('include', '/crm4/')
})

Then('we should see a left bar navigation with the correct items', () => {
  cy.get('.moj-side-navigation__list').children().should('have.length', 9) // Adjust the length if needed based on the actual number of items
})

Then('we should see a right container with static infos displayed', () => {
  cy.get('.govuk-main-wrapper').should('be.visible')
  cy.get('.govuk-main-wrapper').contains('General Information')
})

Then('the General Information page should be displayed with the correct layout', () => {
  cy.contains('Is the total authority for which you are applying more than or equal to £100?').should('be.visible')
  cy.contains('Is your application in relation to a Post Mortem examination?').should('be.visible')
})

// New Steps for Expenditure Details Verification
Given('the user is on the CRM4 case page', () => {
  cy.url().should('include', '/crm4/')
})

When('the user clicks on {string}', linkText => {
  cy.contains(`${linkText}`).click()
})

Then('the Expenditure Details page should be displayed with the correct layout', () => {
  cy.contains('Expenditure Details').should('be.visible')
  cy.contains('Type of Expenditure').should('be.visible')
  cy.contains(
    'Have you already been granted Prior Authority for this case under the same category of expenditure?',
  ).should('be.visible')
  cy.contains('Name of Expert').should('be.visible')
  cy.contains('Company Name').should('be.visible')
  cy.contains('Type / Status of Expert').should('be.visible')
  cy.contains('Postcode of Expert').should('be.visible')
})
