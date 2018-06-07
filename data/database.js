const MongoClient = require('mongodb').MongoClient;


var roverDb;
var roverDbo;

var url;
var dbName;

module.exports.config = function(configUrl, configDb){
  url = configUrl;
  dbName = configDb;
}

module.exports.connect = function(){
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
module.exports.aggregateObjects = function (fromType, aggType){
  return new Promise( (resolve, reject) => {
    roverDbo.collection(aggType).aggregate([
      { $lookup:
        {
          from: fromType,
          localField: fromType+'_id',
          foreignField: '_id',
          as: fromType
        }
      },
      { $unwind: '$'+fromType},
      { $group:
          { _id: '$sitter.sitter',
            sitter_name: { $first: '$sitter.sitter' },
            sitter_image: { $first: '$sitter.sitter_image' },
            sitter_rating_avg: { $avg: '$rating' },
            sitter_rating_count: { $sum: 1 }
          }
        },
      { $sort: { sitter_rating_avg: -1 } }
      ]).toArray()
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

module.exports.dropDatabase = function(){
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
