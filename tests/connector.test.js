const psql = require('../db/connector.js');

test('Expect the connector to return a query method', () => {
  expect(psql).toHaveProperty('query');
});