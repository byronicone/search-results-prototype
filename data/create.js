const filter = require('../util/filter');
const database = require('./database');
const schema = require('./schema');
const R = require('ramda');

module.exports.insert = async function(reviews){
  let result = await database.connectAndCallback(reviews,insertReviews);
  return result;
}

async function insertReviews(client, reviews){
  return new Promise( (resolve, reject) => {
    let reviewPromises = reviews.map( (review) => {
      return [database.insertObject(client, {type: schema.SITTER.TYPE, obj: filter.getSitter(review)}),
      database.insertObject(client, {type: schema.VISIT.TYPE, obj: filter.getVisit(review)}),
      database.insertObject(client, {type: schema.OWNER.TYPE, obj: filter.getOwner(review)}),
      Promise.all(
        filter.getDogs(review)
          .map( (dogObj) => database.insertObject
            (client, {type: schema.DOG.TYPE, obj: dogObj}))
      )]
    })

    Promise.all(R.flatten(reviewPromises)).then(resolve).catch(reject);
  })
}
