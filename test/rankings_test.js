const chai = require('chai');
const expect = chai.expect;
const rankings = require('../search/rankings');

describe('Sitter rankings', () => {
  const database = require('../data/database');
  context('retrieval', () => {
    it('should return visit ratings for all sitters', async () => {
      let sitterRankings = await rankings.getSitterRankings()
      expect(sitterRankings).to.have.length(3);
      expect(sitterRankings[0].sitter_rating_count).to.equal(2)
      expect(sitterRankings[0].sitter_rating_avg).to.equal(3.5)
      expect(sitterRankings[0].sitter_ranking).to.equal(1.62)
    })
  })
  context('calculations', () => {
    let testSitter;
    beforeEach( () => {
      testSitter = require('./data/test_sitter.json');
    })
    it('should calculate sitter score from letters in name', () => {
      let sitter = rankings.calculateSitterScore(testSitter)
      expect(sitter.sitter_score).to.equal(2.12)
    })
    it('should calculate rankings as a weighted average of visit ratings multiplied by sitter score', () => {
      testSitter.sitter_rating_avg=5.0
      testSitter.sitter_score=2.5

      for(let i = 0; i <=12; i++){
        testSitter.sitter_rating_count=i;

        let weight = i <= 10 ? 0.25 * i : 2.5;  //for 11 and 12, we don't increment the weight anymore.

        let score = testSitter.sitter_score + weight;
        rankings.calculateSitterStats(testSitter);
        expect(testSitter.sitter_ranking).to.equal(score);
      }
    })
  })
})
