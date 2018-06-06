const filter = require('../util/filter');
const database = require('./database');
const schema = require('./schema');
const R = require('ramda');

module.exports.connectAndInsert = function(reviews){
  return new Promise( (resolve, reject) => {
    try{
      database.connect().then( () => {
        insertAllReviewData(reviews).then( (reviewPromises) => {
          Promise.all(reviewPromises).then( (insertions) => {
            database.close();
            resolve(insertions);
          }).catch( (err) => {
            reject(err);
          });
        })
      })
    }
    catch(e){
      reject(err);
    }
})
}

async function insertAllReviewData(reviews){
  return reviews.map( (review) => {
    return new Promise( (resolve, reject) => {
      Promise.all([insertSitterAndVisit(review), insertOwnerAndDogs(review)])
      .then( (twoResults) => {
        let inserted = R.merge(twoResults[0], twoResults[1]);
        let appointmentPromises  = [];

        inserted.dog_ids.map( (dogId) => {
            insertDogAppointment(inserted.visit_id, dogId);
        })

        resolve(inserted);

      }).catch( (err) => {
        reject(err);
      })
    })
  })
}

function insertSitterAndVisit(review){
    return new Promise( (resolve, reject) => {
      database.insertObject(schema.SITTER.TYPE, filter.getSitter(review))
      .then( (sitter) => {
        let visitObj = R.assoc("sitter_id", sitter.insertedId, filter.getVisit(review));
        visitObj.rating = parseInt(visitObj.rating);
        database.insertObject(schema.VISIT.TYPE, visitObj)
          .then( (visitResp) => {
            resolve({'sitter_id': sitter.insertedId, 'visit_id': visitResp.insertedId});
          }).catch( (err) => {
            console.log("Failed to insert visit data");
            console.log(err);
            reject(err);
          })
      })
      .catch( (err) => {
        console.log("Failed to insert sitter data");
        reject(err);
      })
    })
}

function insertOwnerAndDogs(review){
    return new Promise( (resolve, reject) => {
      let owner = filter.getOwner(review);
      database.insertObject(schema.OWNER.TYPE, owner)
      .then( (ownerResp) => {

        let dogPromises = [];

        ownerDogs = owner.dogs.split('|');
        for(let dog of ownerDogs){
          dogPromises.push(insertDog(ownerResp.insertedId, dog));
        }

        Promise.all(dogPromises).then( (goodDogs) => {
          resolve({'owner_id': ownerResp.insertedId, 'dog_ids': goodDogs});
        }).catch( (badDogError) => {
          reject(badDogError);
        })
      })
      .catch( (badOwnerError) => reject(badOwnerError) )

    })
}


function insertDog(ownerId, dog){
  return new Promise( (resolve, reject) => {
    database.insertObject(schema.DOG.TYPE, {"owner_id": ownerId, "dog": dog})
      .then( (goodDog) => resolve(goodDog.insertedId))
      .catch( (badDog) => reject(badDog))
  })
}

function insertDogAppointment(visitId, dogId){
  return new Promise( (resolve, reject) => {
    database.insertObject(schema.DOG_APPOINTMENT.TYPE, {"visit_id": visitId, "dog_id": dogId})
      .then( (goodDog) => resolve({'appointment_id': goodDog}))
      .catch( (badDog) => reject(badDog))
  })
}
