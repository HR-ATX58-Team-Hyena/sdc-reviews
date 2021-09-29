DROP DATABASE IF EXISTS reviewsdb;
CREATE DATABASE reviewsdb;
\c reviewsdb;

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  review_id SERIAL NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  epoch BIGINT NOT NULL,
  summary VARCHAR NULL,
  body TEXT NULL,
  recommend BOOL DEFAULT false,
  reported BOOL DEFAULT false,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response TEXT NULL,
  helpfulness INTEGER DEFAULT 0,
  date TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url VARCHAR NOT NULL
);

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slogan VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  default_price MONEY NOT NULL
);

DROP TABLE IF EXISTS characteristics;

CREATE TABLE characteristics (
  characteristic_id SERIAL NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR NOT NULL
);

DROP TABLE IF EXISTS characteristic_reviews;

CREATE TABLE characteristic_reviews (
  char_review_id SERIAL NOT NULL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NULL,
  value INTEGER DEFAULT 3
);

\COPY reviews (review_id, product_id, rating, epoch, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/donvida/Documents/Repos/sdc-data/starterReviews.csv' DELIMITER ',' CSV HEADER;

UPDATE reviews SET date = to_timestamp(floor(epoch / 1000));
ALTER TABLE reviews DROP COLUMN epoch

\COPY photos (photo_id, review_id, url) FROM '/Users/donvida/Documents/Repos/sdc-data/starterReviewsPhotos.csv' DELIMITER ',' CSV HEADER;

\COPY products (product_id, name, slogan, description, category, default_price) FROM '/Users/donvida/Documents/Repos/sdc-data/starterProducts.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics (characteristic_id, product_id, name) FROM '/Users/donvida/Documents/Repos/sdc-data/starterCharacteristics.csv' DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews (char_review_id, characteristic_id, review_id, value) FROM '/Users/donvida/Documents/Repos/sdc-data/starterCharacteristicReviews.csv' DELIMITER ',' CSV HEADER;