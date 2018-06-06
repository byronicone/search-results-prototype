const filter = require('../util/filter');
const expect = require('chai').expect;

const schema = require('../data/schema');
const oneReview = require('./data/one_review');

describe('filter functions', () => {
  it('should filter to just sitter data', () => {
      let filteredReview = filter.getSitter(oneReview);
      expect(filteredReview).to.have.all.keys(schema.SITTER.KEYS);
      expect(filteredReview).to.not.have.all.keys(schema.OWNER.KEYS.concat(schema.VISIT.KEYS));
    })
  it('should filter to just owner data', () => {
    let filteredReview = filter.getOwner(oneReview);
    expect(filteredReview).to.have.all.keys(schema.OWNER.KEYS);
    expect(filteredReview).to.not.have.all.keys(schema.SITTER.KEYS.concat(schema.VISIT.KEYS));
  })
  it('should filter to just visit data', () => {
    let filteredReview = filter.getVisit(oneReview);
    expect(filteredReview).to.have.all.keys(schema.VISIT.KEYS);
    expect(filteredReview).to.not.have.all.keys(schema.SITTER.KEYS.concat(schema.OWNER.KEYS));
  })
})
