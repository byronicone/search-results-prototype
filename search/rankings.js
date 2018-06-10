var rank = {};

const read = require('../data/read');
const R = require('ramda');
const schema = require('../data/schema');

rank.getSitterRankings = async function(minimumRating = 0){
  let sitterRankings = await read.getVisits(minimumRating);
  return sitterRankings
    .map( (sitter) => {
      let withStats = rank.calculateSitterStats(rank.calculateSitterScore(sitter))
      return withStats;
    })
    .sort( function(a,b) { return b.sitter_ranking - a.sitter_ranking } )
}

rank.calculateSitterStats = function(sitter){

  sitter.sitter_rating_avg = Math.round(sitter.sitter_rating_avg*100)/100;


  let ratingWeight = Math.min(1, sitter.sitter_rating_count/10);

  let scoreWeight = 1 - ratingWeight;

  sitter.sitter_ranking = Math.round(
    (sitter.sitter_score * scoreWeight + sitter.sitter_rating_avg * ratingWeight)
    *100)/100;

  return sitter;
}

rank.calculateSitterScore = function(sitter){
  let alphasOnly = sitter.sitter_name.replace(/[^a-zA-Z]/g, '').toLowerCase().split('')
  let uniqueSet = alphasOnly.reduce((set, alpha)=> {
    set.add(alpha)
    return set
  }, new Set())

  sitter.sitter_score = Math.round((5 * (uniqueSet.size/26))*100)/100;
  return sitter;
}

for(prop in rank) {
   if(rank.hasOwnProperty(prop)) {
     module.exports[prop] = rank[prop];
   }
}
