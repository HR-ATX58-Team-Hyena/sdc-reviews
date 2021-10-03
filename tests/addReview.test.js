const { addReview } = require('../db/modules');

test('addReview should provide a response', done => {
  const testData = {
    product_id: 9,
    rating: 4,
    summary: 'Fun Times!',
    body: 'It was the best adventure ever',
    recommend: true,
    name: 'UnlikelyHero',
    email: 'unlikely@hero.com',
    photos: ['https://find.thisphoto.com/photo.jpg'],
    characteristics: {
      "30": 4,
      "31": 2,
      "32": 5,
      "33": 1,
    },
  };

  addReview(testData, (err, res) => {
    expect(err).toBe(null)
    expect(typeof res).toBe('string');
    done();
  });
});

test('addReview should provide a response, when no photos are provided', done => {
  const testData = {
    product_id: 9,
    rating: 4,
    summary: 'Fun Times 3!',
    body: 'It was the best adventure ever',
    recommend: true,
    name: 'UnlikelyHero',
    email: 'unlikely@hero.com',
    characteristics: {
      30: 4,
      31: 2,
      32: 5,
      33: 1,
    },
  };

  addReview(testData, (err, res) => {
    expect(err).toBe(null)
    expect(typeof res).toBe('string');
    done();
  });
});
