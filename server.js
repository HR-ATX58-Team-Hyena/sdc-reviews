const express = require('express');
const redis = require('redis');
const cors = require('cors');
require('newrelic');

// modules
const {
  addReview,
  countHelpful,
  flagReview,
  getReviewsData,
  getMetaData,
} = require('./db/modules');

const app = express();
const cache = redis.createClient();
const port = 3030;
app.use(cors());
app.use(express.json());

// reviews

app.get('/reviews/:product_id/list', (req, res) => {
  console.log('GET reviews request:', req.params);
  cache.get(`${req.params.product_id}/list`, (eCache, cachedReviewsData) => {
    if (eCache) {
      res.status(500).send('Internal Server Error');
      console.log('An error with redis has occured:', eCache);
    } else if (cachedReviewsData) {
      res.send(JSON.parse(cachedReviewsData));
      console.log('... retrieved reviews from cache');
    } else {
      getReviewsData({ product_id: req.params.product_id, ...req.query }, (e, reviewsData) => {
        if (reviewsData) {
          console.log('... retrieved reviews from db');
          res.send(reviewsData);
          cache.setex(`${req.params.product_id}/list`, 600, JSON.stringify(reviewsData));
        } else {
          res.status(500).send('Internal Server Error');
          console.error(e.stack);
        }
      });
    }
  });
});

app.post('/reviews/:product_id', (req, res) => {
  console.log('POST reviews request:', req.params);
  if (req.params?.product_id) {
    addReview({ product_id: req.params.product_id, ...req.body }, (e, response, eStatus) => {
      if (e || eStatus) {
        console.error(e?.stack || e);
        res.status(eStatus || 500).send(typeof e === 'string' ? e : 'Internal server error');
      } else {
        res.status(201).send(response);
      }
    });
  } else {
    res.status(400).send('Please include a product_id in the body of your request.');
  }
});

// reviews/:id/meta

app.get('/reviews/:product_id/meta', (req, res) => {
  console.log('GET reviews/meta request:', req.params);
  cache.get(`${req.params.product_id}/meta`, (eCache, cachedMetaData) => {
    if (eCache) {
      res.status(500).send('Internal Server Error');
      console.log('An error with redis has occured:', eCache);
    } else if (cachedMetaData) {
      res.send(JSON.parse(cachedMetaData));
      console.log('... retrieved reviews/meta from cache');
    } else {
      getMetaData(req.params.product_id, (e, metaData) => {
        if (metaData) {
          console.log('... retrieved reviews/meta from db');
          res.send(metaData);
          cache.setex(`${req.params.product_id}/meta`, 600, JSON.stringify(metaData));
        } else {
          console.error(e.stack);
          res.status(500).send('Internal Server Error');
        }
      });
    }
  });
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
