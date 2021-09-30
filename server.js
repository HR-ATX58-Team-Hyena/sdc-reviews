const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
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
  console.log('GET reviews request:', JSON.stringify(req.query));
  if (req.query?.product_id) {
    res.send(`Successfully called reviews for product ${req.query.product_id}!`);
  } else {
    res.status(400).send('Please provide a product_id parameter');
  }
});

app.post('/reviews', (req, res) => {
  console.log('POST reviews request:', JSON.stringify(req.body));
  if (req.body?.product_id) {
    res.send(`Successfully created a review for product ${req.body.product_id}!`);
  } else {
    res.status(400).send('Please include a product_id in the body of your request.');
  }
});

// reviews/meta

app.get('/reviews/meta', (req, res) => {
  console.log('GET reviews/meta request:', JSON.stringify(req.query));
  if (req.query?.product_id) {
    res.send(`Succcessfully called reviews meta for product ${req.query.product_id}!`);
  } else {
    res.status(400).send('Please provide a product_id parameter');
  }
});

// reviews/:review_id flagging
app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log(`PUT reviews/${req.params.review_id}/helpful request received`);
  res.send(`Successfully marked review ${req.params.review_id} as helpful.`);
});

app.put('/reviews/:review_id/report', (req, res) => {
  console.log(`PUT reviews/${req.params.review_id}/report request received`);
  res.send(`Successfully marked review ${req.params.review_id} as reported.`);
});

// Listening

app.listen(port, (err) => {
  if (err) {
    console.log('Error creating Server');
  } else {
    console.log(`Listening at http://localhost:${port}`);
  }
});
