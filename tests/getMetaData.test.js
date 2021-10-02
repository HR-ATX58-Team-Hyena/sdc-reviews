const { getMetaData } = require('../db/modules.js');

test('getMetaData should pass back an object, but not an array', done => {
  let callback = (err, data) => {
      expect(typeof data).toBe('object');
      expect(Array.isArray(data)).toBe(false);
      expect(err).toBe(null)
      done();
  }

  getMetaData(1, callback)
})

test('getMetaData still passes back an object when given a product id that doesn\'t return results', done => {
  let callback = (err, data) => {
      expect(typeof data).toBe('object');
      expect(data).toHaveProperty('product_id');
      expect(err).toBe(null)
      done();
    }

  getMetaData(987, callback)
})