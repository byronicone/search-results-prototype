const read = require('../data/read')
const R = require('ramda');
const schema = require('../data/schema');

module.exports.calculateSitterScore = function(name){
  let alphasOnly = name.replace(/[^a-zA-Z]/g, '').toLowerCase().split('')
  let uniqueSet = alphasOnly.reduce((set, alpha)=> {
    set.add(alpha)
    return set
  }, new Set())

  return Math.round((5 * (uniqueSet.size/26))*100)/100;
}

module.exports.getSitterRankings = async function(){
  let sitterRankings = await read.getVisits(schema.SITTER.TYPE, schema.VISIT.TYPE);

  sitterRankings.map( (sitter) => {
      sitter.sitter_ranking = calculateSitterRanking(sitter);
    })

  sitterRankings.sort( function(a,b){ return b.sitter_ranking - a.sitter_ranking })
  return sitterRankings;
}

function calculateSitterRanking(sitter){
  let sitterScore = module.exports.calculateSitterScore(sitter.sitter_name);

  let ratingWeight = Math.min(1, sitter.sitter_rating_count/10);
  let scoreWeight = 1 - ratingWeight;
  let sitter_ranking = sitterScore * scoreWeight + sitter.sitter_rating_avg * ratingWeight;
  return Math.round(sitter_ranking*100)/100;
}
