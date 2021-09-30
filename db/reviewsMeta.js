const { psql } = require('./connector');

const getMetaData = (productId, callback) => {
  const metaData = {
    product_id: productId,
  };

  psql.query(`SELECT rating, COUNT (rating) FROM reviews WHERE product_id = ${productId} GROUP BY rating ORDER BY rating ASC`)
    .then((res) => {
      metaData.ratings = {};

      res.rows.forEach((rating) => {
        metaData.ratings[rating.rating] = rating.count;
      });

      return psql.query(`SELECT recommend as recommended, COUNT (recommend) FROM reviews WHERE product_id = ${productId} GROUP BY recommend`);
    }).then((res) => {
      console.log('recommended:', res.rows);
      return psql.query(`SELECT ch.name as name, ch.characteristic_id as id, AVG(chr.value) as value FROM characteristics as ch INNER JOIN characteristic_reviews as chr ON ch.characteristic_id = chr.characteristic_id WHERE product_id = ${productId} GROUP BY ch.characteristic_id`);
    }).then((res) => {
      console.log('characteristics:', res.rows);
      callback(null, metaData);
    })
    .catch((e) => callback(e));
};

module.exports = getMetaData;

// TESTING
getMetaData(1, (e, metaData) => {
  if (e) {
    console.error(e.stack);
  } else {
    console.log(JSON.stringify(metaData, null, '  '));
  }
});
