const chai = require('chai');
const expect = chai.expect;

var create = require('../data/create');
var read = require('../data/read');
var database = require('../data/database');
var rankings = require('../search/rankings');

const reviews = require('./data/reviews');

describe('Data operations', () => {
  beforeEach( () => {
    database.config('mongodb://localhost:27017/', 'rovertest');
  })
  after( () => {
    database.dropDatabase('rovertest');
  })
  context('INSERT', () => {
    it('should insert data into roverdb', async () => {
      let result = await create.connectAndInsert(reviews);
      expect(result).to.have.length(reviews.length);
      result.map( (insertions) => {
        expect(insertions.sitter_id).to.be.ok;
        expect(insertions.owner_id).to.be.ok;
        expect(insertions.visit_id).to.be.ok;
        insertions.dog_ids.map( (dogId) => {
          expect(dogId).to.be.ok;
        })
      })
    })
  })
  context('READ', () => {
    it('should read sitters from roverdb', async () => {
      let sitters = await read.getSitters();

      expect(sitters).to.have.length(reviews.length);

    })
    it('should read owners from roverdb', async () => {
      let owners = await read.getOwners();

      expect(owners).to.have.length(reviews.length);

    })
    it('should read visits from roverdb', async () => {
      let visits = await read.getVisits();
      visits= visits.reduce( (accum, visit) => {
        return accum + visit.sitter_rating_count;
      }, 0)
      expect(visits).to.equal(reviews.length);

    })
    it('should read dogs from roverdb', async () => {
      let dogs = await read.getDogs();

      expect(dogs).to.have.length(9);
    })
  })
  context('Sitter rankings', () => {
    it('should calculate sitter score from letters in name', () => {
      let sitterScore = rankings.calculateSitterScore('Bartholomew Z.')
      expect(sitterScore).to.equal(2.12)
    })
    it('should return visit ratings for all sitters', async () => {
      let sitterRatings = await rankings.getSitterRankings()
      expect(sitterRatings[0].sitter_rating_count).to.equal(2)
      expect(sitterRatings[0].sitter_rating_avg).to.equal(3.5)
      expect(sitterRatings[0].sitter_ranking).to.equal(1.62)
    })
    it('should calculate ratings score as average of visit ratings', () => {
    })
  })
})
