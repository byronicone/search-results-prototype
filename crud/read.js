const database = require('./database');
const schema = require('./schema');

module.exports.getSitters = function(){
  return new Promise( (resolve, reject) => {
    database.connect().then( () => {
      database.readObjects(schema.SITTER.TYPE, {})
        .then( (sitters) => {
          resolve(sitters);
          database.close();
        })
    }).catch( (err) => {
      reject(err);
    });
  })
}
module.exports.getOwners = function(){
  return new Promise( (resolve, reject) => {
    database.connect().then( () => {
      database.readObjects(schema.SITTER.TYPE, {})
        .then( (owners) => {
          resolve(owners);
          database.close();
        })
    }).catch( (err) => {
      reject(err);
    });
  })
}
module.exports.getVisits = function(){
  return new Promise( (resolve, reject) => {
    database.connect().then( () => {
      database.readObjects(schema.VISIT.TYPE, {})
        .then( (visits) => {
          resolve(visits);
          database.close();
        })
    }).catch( (err) => {
      reject(err);
    });
  })
}
module.exports.getDogs = function(){
  return new Promise( (resolve, reject) => {
    database.connect().then( () => {
      database.readObjects(schema.DOG.TYPE, {})
        .then( (dogs) => {
          resolve(dogs);
          database.close();
        })
    }).catch( (err) => {
      reject(err);
    });
  })
}
