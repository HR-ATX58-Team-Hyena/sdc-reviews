const { countHelpful } = require('../db/modules');

test('countHelpful should return a successful response from the callback', done => {
  let callback = (err, data) => {
    expect(err).toBe(null);
    expect(typeof data).toBe('string');
    done();
  };

  countHelpful(1, callback);
});
