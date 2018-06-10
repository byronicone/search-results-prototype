const filter = require('../util/filter');
const expect = require('chai').expect;

const schema = require('../data/schema');
const oneReview = require('./data/one_review');

describe('filter functions', () => {
  it('should filter to just sitter data', () => {
      let sitterArr = filter.getSitter(oneReview);
      expect(sitterArr).to.have.all.keys(schema.SITTER.KEYS);
      expect(sitterArr).to.not.have.all.keys(schema.OWNER.KEYS.concat(schema.VISIT.KEYS));
    })
  it('should filter to just owner data', () => {
    let ownerArr = filter.getOwner(oneReview);
    expect(ownerArr).to.have.all.keys(schema.OWNER.KEYS);
    expect(ownerArr).to.not.have.all.keys(schema.SITTER.KEYS.concat(schema.VISIT.KEYS));
  })
  it('should filter to just visit data', () => {
    let visitsArr = filter.getVisit(oneReview);
    expect(visitsArr).to.have.all.keys(schema.VISIT.KEYS);
    expect(visitsArr).to.not.have.all.keys(schema.SITTER.KEYS.concat(schema.OWNER.KEYS));
  })
  it('should filter to just dog data and return as separate rows', () => {
    let dogArr = filter.getDogs(oneReview);
    expect(dogArr).to.have.length(oneReview.dogs.split('|').length);
  })
})
