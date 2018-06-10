const schema = require('../data/schema');
const R = require('ramda');

module.exports.getSitter = function(review){
    return R.pick(schema.SITTER.KEYS, review);
}

module.exports.getOwner = function(review){
    return R.pick(schema.OWNER.KEYS, review);
}
module.exports.getDogs = function(review){
    let oneRow = R.pick(schema.DOG.KEYS, review);
    let ownerName = oneRow.owner;
    let dogs = oneRow.dogs.split('|');
    return dogs.map( (dogName) => {
        return {'dog':dogName, 'owner':ownerName}
    })
}

module.exports.getVisit = function(review){
    let visit =  R.pick(schema.VISIT.KEYS, review);
    visit.rating = parseInt(visit.rating);
    return visit;
}
