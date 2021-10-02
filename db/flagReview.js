const psql = require('./connector');

const flagReview = (reviewID, callback) => {
  const parameterizedID = [reviewID];
  psql.query('UPDATE reviews SET reported = true WHERE review_id = $1', parameterizedID)
    .then(() => {
      callback(null, `Successfully flagged review ${reviewID} as reported.`);
    }).catch((e) => callback(e));
};

module.exports = flagReview;
