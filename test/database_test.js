const chai = require('chai');
const expect = chai.expect;

var st = require('../data/setup-teardown');
var read = require('../data/read');
var fl = require('../util/file_loader');

const reviews = require('./data/reviews');

before( () => {
  return new Promise( (resolve, reject) => {
    st.prepare(reviews).then(resolve).catch(reject);
  })
})
after( () => {
  return new Promise( (resolve, reject) => {
    st.purge().then(st.shutdown).then(resolve).catch(reject);
  })
})

describe('Data operations', () => {
  context('READ', () => {
    it('should read sitters from roverdb', async () => {
      let sitters = await read.getSitters();
      expect(sitters).to.have.length(3);

    })
    it('should read all visits from roverdb', async () => {
      let visits = await read.getVisits();
      visits= visits.reduce( (accum, visit) => {
        return accum + visit.sitter_rating_count;
      }, 0)
      expect(visits).to.equal(reviews.length);
    })
    it('should read visits with a minimum rating of 3', async () => {
      let visits = await read.getVisits(3);
      visits= visits.reduce( (accum, visit) => {
        return accum + visit.sitter_rating_count;
      }, 0)
      expect(visits).to.equal(3);
    })
  })
})
