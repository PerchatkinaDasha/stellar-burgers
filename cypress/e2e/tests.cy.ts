import cypress from 'cypress';
import * as order from '../fixtures/order.json';

const main = '[data-cy="main"]';
const bun = '[data-cy="bun"]';
const sauce = '[data-cy="sauce"]';
const modals = '[data-cy="modal"]';
const mainConstructor = '[data-cy="ingredient-constructor"]';
const bunConstructor = '[data-cy="bun-constructor"]';
const modalCloseButton = '[data-cy="modal-close-button"]';

describe('проверка конструктора', function () {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order' }).as('postOrder');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user' }).as('getUser');
    cy.visit('/');
  });

  this.afterAll(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('должен проверить отрисовку компонента', function () {
    cy.get(bun).should('exist');
    cy.get(main).should('exist');
    cy.get(sauce).should('exist');
  });

  it('должен удалить/добавить ингредиент и булки в конструкторе', function () {
    const bunStore = cy.get(bun).first().children();
    const mainStore = cy.get(main).first().children();
    const mainStoreSecond = cy.get(main).first().next().children();

    bunStore.last().click();
    mainStore.last().click();
    mainStoreSecond.last().click();

    cy.get(bunConstructor).contains('Краторная булка N-200i');
    cy.get(mainConstructor).contains('Биокотлета из марсианской Магнолии');
    cy.get(mainConstructor).contains('Филе Люминесцентного тетраодонтимформа');

    cy.get('[data-cy=ingredient-constructor-without-button]')
      .children()
      .children()
      .children()
      .last()
      .click();

    cy.get(mainConstructor)
      .not('Филе Люминесцентного тетраодонтимформа')
      .contains('Биокотлета из марсианской Магнолии');
  });

  describe('проверка модального окна', function () {
    it('должен проверить открытия модального окна на кнопку', function () {
      cy.get(modals).should('not.exist');
      cy.get(bun).first().click();
      cy.get(modals).should('exist');
    });

    it('должен проверить закрытия модального окна на кнопку', function () {
      cy.get(bun).first().click();
      cy.get(modalCloseButton).first().click();
      cy.get(modals).should('not.exist');
    });

    it('должен проверить закрытия модального окна по оверлею', function () {
      cy.get(bun).first().click();
      cy.get('[data-cy="modal-close-overlay"]').first().click({ force: true });
      cy.get(modals).should('not.exist');
    });
  });

  describe('проверка оформления заказа', function () {
    beforeEach(function () {
      cy.setCookie('accessToken', 'token');
      cy.reload();
      cy.wait('@getUser');
    });

    it('должен проверить открытия модального окна при нажатии на кнопку Оформить заказ', function () {
      const bunStore = cy.get(bun).first().children();
      const mainStore = cy.get(main).first().children();
      const mainStoreSecond = cy.get(main).first().next().children();

      bunStore.last().click();
      mainStore.last().click();
      mainStoreSecond.last().click();

      cy.intercept('POST', 'api/orders').as('createOrder');

      cy.get("[data-cy='order']").contains('Оформить заказ').click();

      cy.wait('@createOrder').then((interception) => {
        const response = interception.response;

        expect(response).to.not.be.undefined;

        if (response) {
          expect(response.statusCode).to.eq(200);
          expect(response.body.order.number).to.eq(order.order.number);
        }
      });

      cy.get(modals).should('exist');
      cy.get(modals).contains(order.order.number.toString());
    });

    describe('проверка закрытия модального окна', function () {
      beforeEach(function () {
        const bunStore = cy.get(bun).first().children();
        bunStore.last().click();

        cy.intercept('POST', 'api/orders').as('createOrder');

        cy.get("[data-cy='order']").contains('Оформить заказ').click();
      });

      it('должен проверить закрытия модального окна по кнопке', function () {
        cy.get(modalCloseButton).first().click();
        cy.get(modals).should('not.exist');
      });

      it('должен проверить закрытия модального окна по оверлею', function () {
        cy.get('[data-cy="modal-close-overlay"]')
          .first()
          .click({ force: true });
        cy.get(modals).should('not.exist');
      });
    });

    describe('проверка очистки конструктора', function () {
      it('должен проверить на очистку конструктора', function () {
        const bunStore = cy.get(bun).first().children();
        bunStore.last().click();

        cy.get("[data-cy='order']").contains('Оформить заказ').click();
        cy.get(modalCloseButton).first().click();
        cy.get(bunConstructor).should('not.exist');
        cy.get(mainConstructor).should('not.exist');
      });
    });
  });
});
