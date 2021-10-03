DROP DATABASE IF EXISTS reviewsdb;
CREATE DATABASE reviewsdb;
\c reviewsdb;

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

CREATE INDEX product_reviews_index ON reviews(product_id);

CREATE TABLE photos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url VARCHAR NOT NULL,
  CONSTRAINT fk_review_id
    FOREIGN KEY(review_id)
      REFERENCES reviews(review_id)
      ON DELETE CASCADE
);


CREATE TABLE characteristics (
  characteristic_id SERIAL NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR NOT NULL
);

CREATE INDEX product_chars_index ON characteristics(product_id);


CREATE TABLE characteristic_reviews (
  char_review_id SERIAL NOT NULL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NULL,
  value INTEGER DEFAULT 3,
  CONSTRAINT fk_characteristic_id
    FOREIGN KEY(characteristic_id)
      REFERENCES characteristics(characteristic_id)
      ON DELETE CASCADE,
  CONSTRAINT fk_review_id
    FOREIGN KEY(review_id)
      REFERENCES reviews(review_id)
        ON DELETE CASCADE
);

CREATE INDEX review_char_reviews_index ON characteristic_reviews(review_id);

\COPY reviews (review_id, product_id, rating, epoch, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/donvida/Documents/Repos/sdc-data/reviews.csv' DELIMITER ',' CSV HEADER;

UPDATE reviews SET date = to_timestamp(floor(epoch / 1000));
ALTER TABLE reviews DROP COLUMN epoch;

SELECT setval(pg_get_serial_sequence('reviews', 'review_id'), max(review_id)) FROM reviews;

\COPY photos (photo_id, review_id, url) FROM '/Users/donvida/Documents/Repos/sdc-data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

SELECT setval(pg_get_serial_sequence('photos', 'photo_id'), max(photo_id)) FROM photos;

\COPY characteristics (characteristic_id, product_id, name) FROM '/Users/donvida/Documents/Repos/sdc-data/characteristics.csv' DELIMITER ',' CSV HEADER;

SELECT setval(pg_get_serial_sequence('characteristics', 'characteristic_id'), max(characteristic_id)) FROM characteristics;

\COPY characteristic_reviews (char_review_id, characteristic_id, review_id, value) FROM '/Users/donvida/Documents/Repos/sdc-data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

SELECT setval(pg_get_serial_sequence('characteristic_reviews', 'char_review_id'), max(char_review_id)) FROM characteristic_reviews;