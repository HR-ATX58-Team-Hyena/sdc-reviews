const { flagReview } = require('../db/modules');

test('flagReview should return a successful response from the callback', done => {
  let callback = (err, data) => {
    expect(err).toBe(null);
    expect(typeof data).toBe('string');
    done();
  };

  flagReview(1, callback);
});
