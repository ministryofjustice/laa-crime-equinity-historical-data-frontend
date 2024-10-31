import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor'

Before(() => {
  cy.task('reset')
})

Given('the user is on the Historical Data page', () => {
  cy.visit('/')
})

When('the user selects {string} link', linkText => {
  cy.contains(`${linkText}`).click()
})

When('the user selects {string} from the CRM type dropdown and clicks search', crmType => {
  cy.task('stubSearchApi', { type: 4, typeName: 'CRM5' })
  cy.get('#type').select(`${crmType}`)
  cy.get('button[type="submit"]').click()
})

When('the user clicks on a Client name or USN link', () => {
  cy.task('stubCrm5Api', { usn: 1234567 })
  cy.get('table.govuk-table tbody tr td.govuk-table__cell  a').first().click()
})

Then('it should return a page related to the corresponding CRM5 case', () => {
  cy.url().should('include', '/crm5/')
})

Then('we should see a left bar navigation with {string} items', numItems => {
  cy.get('.moj-side-navigation__list').children().should('have.length', numItems) // Adjust selector if needed
})

Then('we should see a right container with static infos displayed', () => {
  cy.get('.govuk-main-wrapper').should('be.visible')
  cy.get('.govuk-main-wrapper').contains('General Information')
})

Then('the Costs page should be displayed with the correct layout', () => {
  cy.contains('Costs').click()
  cy.contains('Costs Accrued to Date').should('be.visible')
})
