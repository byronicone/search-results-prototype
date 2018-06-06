const fl = require('../file_loader');
const expect = require('chai').expect;

describe('CSV Parsing', () => {
  it('should transform csv to json', () => {
    fl.loadReviews( (reviewArray) => {
      expect(reviewArray).to.have.lengthOf(500);
    })
  })
})
