const schema = require('../crud/schema');
const R = require('ramda');

module.exports.getSitter = function(review){
    return R.pick(schema.SITTER.KEYS, review);
}

module.exports.getOwner = function(review){
    return R.pick(schema.OWNER.KEYS, review);
}

module.exports.getVisit = function(review){
    return R.pick(schema.VISIT.KEYS, review);
}
