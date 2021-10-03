const psql = require('./connector');

const verifyChars = (productID, charsData, callback) => {
  const parameterizedID = [productID];
  psql.query('SELECT characteristic_id as id FROM characteristics WHERE product_id = $1', parameterizedID)
    .then((res) => {
      let verified = false;
      if (res.rows.length) {
        verified = res.rows.every((row) => !!charsData[row.id]);
      }
      if (!verified) {
        callback('One or more characteristic_id\'s do not belong to the product', null, 404);
      } else {
        callback(null, verified);
      }
    })
    .catch((e) => callback(e));
};

async function insertReviews(trans, reviewParams) {
  const insertReviewQuery = `
        INSERT INTO
          reviews(product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
        RETURNING review_id;
      `;
  const reviewResponse = await trans.query(insertReviewQuery, reviewParams);
  return reviewResponse.rows[0].review_id;
}

function insertPhotos(photos, reviewID, trans) {
  if (photos?.length) {
    photos.forEach(async (photoUrl) => {
      const photoParams = [reviewID, photoUrl];
      const insertPhotoQuery = `
            INSERT INTO
              photos(review_id, url)
            VALUES
              ($1, $2)
            RETURNING review_id;
          `;
      await trans.query(insertPhotoQuery, photoParams);
    });
  }
}

function insertCharacteristics(charsList, reviewID, trans) {
  if (charsList.length) {
    charsList.forEach(async (charReview) => {
      const charParams = [reviewID, charReview[0], charReview[1]];
      const insertCharQuery = `
          INSERT INTO
            characteristic_reviews(review_id, characteristic_id, value)
          VALUES
            ($1, $2, $3)`;
      await trans.query(insertCharQuery, charParams);
    });
  }
}

const addReview = (reviewData, callback) => {
  const productID = reviewData.product_id;
  const { photos = [], characteristics = {} } = reviewData;

  verifyChars(productID, characteristics, async (err, verified) => {
    if (!verified) {
      return callback(err);
    }
    const charsList = characteristics ? Object.entries(characteristics) : [];
    const reviewParams = [
      productID,
      reviewData.rating,
      reviewData.summary,
      reviewData.body,
      reviewData.recommend,
      reviewData.name,
      reviewData.email];

    const trans = await psql.connect();

    try {
      await trans.query('BEGIN');
      const reviewID = await insertReviews(trans, reviewParams);
      await insertPhotos(photos, reviewID, trans);
      await insertCharacteristics(charsList, reviewID, trans);
      await trans.query('COMMIT');

      callback(null, `Successfully added review for ${productID}`);
    } catch (error) {
      await trans.query('ROLLBACK');
      callback(error);
    } finally {
      trans.release();
    }

    return null;
  });
};

module.exports = addReview;
