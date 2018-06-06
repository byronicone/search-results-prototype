const dotenv = require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;

var create = require('../crud/create');
var read = require('../crud/read');
var database = require('../crud/database');

const threeReviews = require('./data/three_reviews');

describe('Database Operations', () => {
  after( () => {
    database.dropDatabase();
  })
  context('INSERT', () => {
    it('should insert data into roverdb', async () => {
      let result = await create.connectAndInsert(threeReviews);
      expect(result).to.have.length(3);
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
      let sitters = await read.getSitters(threeReviews);

      expect(sitters).to.have.length(3);

    })
    it('should read owners from roverdb', async () => {
      let owners = await read.getOwners(threeReviews);

      expect(owners).to.have.length(3);

    })
    it('should read visits from roverdb', async () => {
      let visits = await read.getVisits(threeReviews);

      expect(visits).to.have.length(3);

    })
    it('should read dogs from roverdb', async () => {
      let dogs = await read.getDogs(threeReviews);

      expect(dogs).to.have.length(6);
    })
  })
})
