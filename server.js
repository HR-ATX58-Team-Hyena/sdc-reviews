const express = require('express');
const cors = require('cors');

// modules
const {
  countHelpful,
  flagReview,
  getReviewsData,
  getMetaData,
} = require('./db/modules');

const app = express();
const port = 3030;
app.use(cors());
app.use(express.json());

// reviews

app.get('/reviews/:product_id/list', (req, res) => {
  console.log('GET reviews request:', JSON.stringify({ ...req.params, ...req.query }));
  if (req.params?.product_id) {
    getReviewsData({ product_id: req.params.product_id, ...req.query }, (e, reviewsData) => {
      if (e) {
        console.error(e.stack);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(reviewsData);
      }
    });
  }
});

app.post('/reviews/:product_id', (req, res) => {
  console.log('POST reviews request:', JSON.stringify(req.body));
  if (req.params?.product_id) {
    res.send(`Successfully created a review for product ${req.params.product_id}!`);
  } else {
    res.status(400).send('Please include a product_id in the body of your request.');
  }
});

// reviews/:id/meta

app.get('/reviews/:product_id/meta', (req, res) => {
  console.log('GET reviews/meta request:', req.params);
  if (req.params?.product_id) {
    getMetaData(req.params.product_id, (e, metaData) => {
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
app.put('/reviews/helpful/:review_id', (req, res) => {
  console.log('PUT reviews/helpful request received');
  countHelpful(req.params.review_id, (e, response) => {
    if (e) {
      console.log(e.stack);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(response);
    }
  });
});

app.put('/reviews/report/:review_id', (req, res) => {
  console.log('PUT reviews/helpful request received');
  flagReview(req.params.review_id, (e, response) => {
    if (e) {
      console.log(e.stack);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(response);
    }
  });
});

// Listening

app.listen(port, (err) => {
  if (err) {
    console.log('Error creating Server');
  } else {
    console.log(`Listening at http://localhost:${port}`);
  }
});
