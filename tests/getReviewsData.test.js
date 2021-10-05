const { getReviewsData } = require('../db/modules');

test('getReviewsData should return a results array when provided a valid product_id', done => {
  let callback = (err, data) => {
    expect(err).toBe(null);
    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBe(true);
    done();
  }

  getReviewsData(9, callback);
});
