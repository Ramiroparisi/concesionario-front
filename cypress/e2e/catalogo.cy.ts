// cypress/e2e/catalogo.cy.ts

describe('Flujo de Usuario: Consulta de Catálogo', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/vehiculos*', {
      statusCode: 200,
      body: {
        data: [
          {
            id: 1,
            precio: 235000,
            color: 'Negro',
            estado: 'Disponible',
            modelo: { 
              nombre: 'X6 M Competition', 
              marca: { nombre: 'BMW' } 
            },
            multimedia: []
          }
        ]
      }
    }).as('getVehiculosMock');
  });

  it('debería navegar desde el inicio hasta el catálogo y ver los vehículos', () => {
    cy.visit('http://localhost:3001');
    cy.contains('Parisi Motors').should('be.visible');
    cy.get('nav').contains('Vehiculos').click();
    cy.url().should('include', '/Vehiculos');
    cy.wait('@getVehiculosMock');
    cy.get('body').should('contain.text', 'BMW');
    cy.get('body').should('contain.text', 'X6 M Competition');
    cy.get('body').should('contain.text', '235.000');
  });
});