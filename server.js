const express = require('express');
const cors = require('cors');

// modules
const {
  getReviewsData,
  getMetaData,
} = require('./db/modules.js');

const app = express();
const port = 3030;
app.use(cors());
app.use(express.json());

// reviews

app.get('/reviews', (req, res) => {
  console.log('GET reviews request:', JSON.stringify(req.query));
  if (req.query?.product_id) {
    getReviewsData(req.query, (e, reviewsData) => {
      if (e) {
        console.error(e.stack);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(reviewsData);
      }
    });
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
    getMetaData(req.query.product_id, (e, metaData) => {
      if (e) {
        console.error(e.stack);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(metaData);
      }
    });
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
