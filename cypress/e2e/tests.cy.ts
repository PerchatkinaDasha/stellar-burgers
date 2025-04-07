import cypress from 'cypress';
import * as order from '../fixtures/order.json';

describe('Burger Constructor Integration Tests', function () {
  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('postOrder');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  after(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('should render ingredients correctly', function () {
    cy.get('[data-cy="bun"]').should('be.visible');
  });

  it('should add and remove ingredients from the constructor', function () {
    cy.get('[data-cy="bun"]').first().trigger('dragstart');
    cy.get('[data-cy="bun-constructor"]').trigger('drop');
    
    cy.get('[data-cy="main"]').first().trigger('dragstart');
    cy.get('[data-cy="ingredient-constructor"]').trigger('drop');
    
    cy.get('[data-cy="bun-constructor"]').contains('Краторная булка N-200i');
    cy.get('[data-cy="ingredient-constructor"]').contains('Биокотлета из марсианской Магнолии');
    
    cy.get('[data-cy="ingredient-constructor"] [data-cy="delete-button"]').last().click();
    cy.get('[data-cy="ingredient-constructor"]').should('not.contain', 'Биокотлета из марсианской Магнолии');
  });

  describe('Modal window tests', function () {
    it('should open and close modal by button', function () {
      cy.get('[data-cy="bun"]').first().click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('should close modal by clicking overlay', function () {
      cy.get('[data-cy="bun"]').first().click();
      cy.get('[data-cy="modal-close-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Order placement tests', function () {
    beforeEach(function () {
      cy.setCookie('accessToken', 'mockToken123');
      cy.reload();
      cy.wait('@getUser');
    });

    it('should place an order and verify modal', function () {
      cy.get('[data-cy="bun"]').first().trigger('dragstart');
      cy.get('[data-cy="bun-constructor"]').trigger('drop');
      
      cy.get('[data-cy="main"]').first().trigger('dragstart');
      cy.get('[data-cy="ingredient-constructor"]').trigger('drop');
      
      cy.intercept('POST', '/api/orders').as('createOrder');
      
      cy.get("[data-cy='order']").contains('Оформить заказ').click();
      
      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal"]').contains(order.order.number.toString());
    });

    it('should close order modal and clear constructor', function () {
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
      cy.get('[data-cy="bun-constructor"]').should('not.exist');
      cy.get('[data-cy="ingredient-constructor"]').should('not.exist');
    });
  });
});
