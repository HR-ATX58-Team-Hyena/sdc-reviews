\c reviewsdb;

-- Ratings
SELECT rating, COUNT (rating) FROM reviews WHERE product_id = 1 GROUP BY rating ORDER BY rating ASC;

-- Recommended
SELECT recommend as recommended, COUNT (recommend) FROM reviews WHERE product_id = 1 GROUP BY recommend;

-- Characteristics
SELECT ch.name as name, ch.characteristic_id as id, AVG(chr.value) as value FROM characteristics as ch INNER JOIN characteristic_reviews as chr ON ch.characteristic_id = chr.characteristic_id WHERE product_id = 1 GROUP BY ch.characteristic_id;