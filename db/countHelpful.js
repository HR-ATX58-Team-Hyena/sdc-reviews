const psql = require('./connector');

const countHelpful = (reviewID, callback) => {
  const parameterizedID = [reviewID];
  psql.query('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1', parameterizedID)
    .then(() => {
      callback(null, `Successfully counted a helpful click for review ${reviewID}`);
    }).catch((e) => callback(e));
};

module.exports = countHelpful;
