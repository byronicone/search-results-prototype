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

module.exports.getSitterRatings = async function(){
  let sitterRatings = await read.getVisits(schema.SITTER.TYPE, schema.VISIT.TYPE);

  sitterRatings.map( (sitter) => {
      sitter.overallSitterRank = calculateSitterRank(sitter);
    })

  return sitterRatings;
}

function calculateSitterRank(sitter){
  let sitterScore = module.exports.calculateSitterScore(sitter._id);

  let ratingWeight = sitter.count/10;
  let scoreWeight = sitter.count < 10 ? 1 - ratingWeight : 0;

  let rank = sitterScore * scoreWeight + sitter.avg * ratingWeight;

  return Math.round(rank*100)/100;
}
