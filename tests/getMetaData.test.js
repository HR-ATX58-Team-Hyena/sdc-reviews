const { getMetaData } = require('../db/modules.js');

test('getMetaData should pass back an object, but not an array', done => {
  let callback = (err, data) => {
    if (data) {
      expect(typeof data).toBe('object');
      expect(Array.isArray(data)).toBe(false);
      done();
    } else {
      done(err);
    }
  }

  getMetaData(1, callback)
})

test('getMetaData still passes back an object when given an invalid product id', done => {
  let callback = (err, data) => {
    if (data) {
      expect(typeof data).toBe('object');
      expect(data).toHaveProperty('product_id');
      done();
    } else {
      done(err);
    }
  }
})