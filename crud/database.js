const MongoClient = require('mongodb').MongoClient;

const dbName = process.env.DATABASE_NAME;
const url = process.env.ROVER_DB_URL;

var roverDb;
var roverDbo;

module.exports.connect = function(reviews){
  return new Promise( (resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if(err){
        reject(err);
      }
      else{
        roverDb = db;
        roverDbo = db.db(dbName);
        resolve();
      }
    })
  })
}

module.exports.insertObject = function (type, obj){
  return new Promise( (resolve, reject) => {
    roverDbo.collection(type).insertOne(obj)
      .then( (resp) => {
      resolve(resp);
    }).catch( (err) => {
      reject(err);
    })
  })
}

module.exports.readObjects = function (type, query){
  return new Promise( (resolve, reject) => {
    roverDbo.collection(type).find(query).toArray()
      .then( (resp) => {
      resolve(resp);
    }).catch( (err) => {
      reject(err);
    })
  })
}

module.exports.close = function close(){
  return new Promise( (resolve, reject) => {
    try{
      roverDb.close();
      resolve();
    }
    catch(err){
      reject(err);
    }
  })
}

module.exports.dropDatabase = function(reviews){
  MongoClient.connect(url, function(err, db) {
    if(err){
      return err;
    }
    var dbo = db.db(dbName);
    dbo.dropDatabase( (err, delOk) => {
      return delOk || err;
    })
  })
}
