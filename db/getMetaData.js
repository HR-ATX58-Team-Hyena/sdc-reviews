const psql = require('./connector');

const getMetaData = (productId, callback) => {
  const metaData = {
    product_id: productId,
  };

  const parameterizedID = [productId];

  psql.query('SELECT rating, COUNT (rating) FROM reviews WHERE product_id = $1 GROUP BY rating ORDER BY rating ASC', parameterizedID)
    .then((res) => {
      metaData.ratings = {};
      if (res.rows.length) {
        res.rows.forEach((rat) => {
          metaData.ratings[rat.rating] = parseInt(rat.count, 10);
        });
      }

      return psql.query('SELECT recommend as recommended, COUNT (recommend) FROM reviews WHERE product_id = $1 GROUP BY recommend', parameterizedID);
    }).then((res) => {
      metaData.recommended = {};

      if (res.rows.length) {
        res.rows.forEach((rec) => {
          metaData.recommended[rec.recommended] = parseInt(rec.count, 10);
        });
      }

      return psql.query('SELECT ch.name as name, ch.characteristic_id as id, AVG(chr.value)::numeric(10, 4) as value FROM characteristics as ch INNER JOIN characteristic_reviews as chr ON ch.characteristic_id = chr.characteristic_id WHERE ch.product_id = $1 GROUP BY ch.characteristic_id', parameterizedID);
    }).then((res) => {
      metaData.characteristics = {};

      if (res.rows) {
        res.rows.forEach((char) => {
          metaData.characteristics[char.name] = {
            id: char.id,
            value: char.value,
          };
        });
      }

      callback(null, metaData);
    })
    .catch((e) => callback(e));
};

module.exports = getMetaData;
