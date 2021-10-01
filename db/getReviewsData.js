const psql = require('./connector.js');

const getReviewsData = ({ product_id, sort = 'newest', count = 5, page = 0 }, callback) => {
  const offset = count * page;
  const reviewsData = {
    product_id,
    page,
    count,
  };

  const parameterizedValues = [product_id, parseInt(count, 10)];

  const selectReviews = 'SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews  WHERE product_id = $1';
  const fetchReviews = ` OFFSET ${offset} ROWS FETCH FIRST $2 ROW ONLY `;
  let sortReviews = 'ORDER BY date DESC'; // will implement relevance

  switch (sort) {
    case 'helpful':
      sortReviews = 'ORDER BY helpfulness DESC';
      break;
    case 'newest':
      sortReviews = 'ORDER BY date DESC';
      break;
    default:
      break;
  }

  psql.query(selectReviews + sortReviews + fetchReviews, parameterizedValues)
    .then((res) => {
      if (res.rows.length) {
        const reviewsObject = {};
        const reviewIDList = [];
        res.rows.forEach((row) => {
          reviewsObject[row.review_id] = { ...row, photos: [] };
          reviewIDList.push(row.review_id);
        });
        psql.query(`SELECT * FROM photos WHERE review_id IN (${reviewIDList.join(', ')})`)
          .then((photoRes) => {
            if (photoRes.rows.length) {
              photoRes.rows.forEach((row) => {
                reviewsObject[row.review_id].photos.push(row);
              });
            }
            reviewsData.results = Object.values(reviewsObject);
            callback(null, reviewsData);
          })
          .catch((e) => callback(e));
      } else {
        reviewsData.results = [];
        callback(null, reviewsData);
      }
    })
    .catch((e) => callback(e));
};

module.exports = getReviewsData;

// TESTING
// getReviewsData({ product_id: 2 }, (err, reviewsData) => {
//   if (err) {
//     console.log('reviews query failed', err.stack)
//   } else {
//     console.log(JSON.stringify(reviewsData, null, '  '));
//   }
// });
