const { Pool } = require('pg');
const { pgConfig } = require('../config.js');

const psql = new Pool(pgConfig);

// TESTING
// psql.query('SELECT * FROM reviews LIMIT 5')
//   .then(res => console.log('Successful query:', res.rows))
//   .catch(e => console.error(e.stack));

module.exports = psql;
