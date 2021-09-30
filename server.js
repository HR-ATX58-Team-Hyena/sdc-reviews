const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3030;

/**
 * ENDPOINTS:
 * /reviews/ - GET (Params: page, count, sort, product_id*) POST
 * /reviews/meta - GET (Params: product_id*)
 * /reviews/:review_id/helpful - PUT (Params: review_id*)
 * /reviews/:review_id/report - PUT (Params: review_id*)
 */

// /reviews

app.get('/reviews', (req, res) => {
  if (!req.query?.product_id) {
    res.send(`Successfully called reviews for ${req.query.product_id}!`);
  } else {
    res.status(400).send('Please provide a product_id');
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log('Error creating Server');
  } else {
    console.log(`Listening at http://localhost:${port}`);
  }
});
