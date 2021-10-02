const psql = require('./connector.js');

const getMetaData = (productId, callback) => {
  const metaData = {
    product_id: productId,
  };

  const parameterizedID = [productId];

  psql.query('SELECT rating, COUNT (rating) FROM reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC', parameterizedID)
    .then((res) => {
      metaData.ratings = {};

      res.rows.forEach((rat) => {
        metaData.ratings[rat.rating] = rat.count;
      });

      return psql.query(`SELECT recommend as recommended, COUNT (recommend) FROM reviews WHERE product_id = ${productId} GROUP BY recommend`);
    }).then((res) => {
      metaData.recommended = {};

      res.rows.forEach((rec) => {
        metaData.recommended[rec.recommended] = rec.count;
      });

      return psql.query(`SELECT ch.name as name, ch.characteristic_id as id, AVG(chr.value) as value FROM characteristics as ch INNER JOIN characteristic_reviews as chr ON ch.characteristic_id = chr.characteristic_id WHERE ch.product_id = ${productId} GROUP BY ch.characteristic_id`);
    }).then((res) => {
      metaData.characteristics = {};

      res.rows.forEach((char) => {
        metaData.characteristics[char.name] = {
          id: char.id,
          value: char.value,
        };
      });
      callback(null, metaData);
    })
    .catch((e) => callback(e));
};

module.exports = getMetaData;

// TESTING
// getMetaData(1, (e, metaData) => {
//   if (e) {
//     console.error(e.stack);
//   } else {
//     console.log(JSON.stringify(metaData, null, '  '));
//   }
// });
