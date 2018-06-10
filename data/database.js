const MongoClient = require('mongodb').MongoClient;

var roverDb;
var db;

var env = process.env.NODE_ENV;
var url = process.env.ROVER_DB_URL;

var roverDbName = env == 'production' ? process.env.DATABASE_NAME : 'roverdbtest'

function* useClient(){
  let client = yield new Promise((resolve,reject) => {
    MongoClient.connect(url, function(err, client) {
      if(err){
        reject(err);
      }
      else{
        resolve(client);
      }
    })
  })
  //doesn't run until .next() is called the second time on the returned iterator!
  if(client != undefined){
    client.close();
  }
}

module.exports.connectAndCallback = function(params, callback){
  return new Promise( async (resolve, reject) => {

    let clientGenerator =  useClient();

    try{
      let client = await clientGenerator.next().value; //opens a connection and returns a client
      callback(client, params)
      .then( (result) => {
        clientGenerator.next(); //resumes the generator, closing the connection
        resolve(result);
      })
    }
    catch(err){
      clientGenerator.next();
      reject(err);
    }

  })
}

module.exports.insertObject = function (client, params){
  return new Promise( async (resolve, reject) => {
   try{
    let response = await client.db(roverDbName)
      .collection(params.type)
       .insertOne(params.obj)

    resolve(response.insertedId);
   }
    catch(err){
      if(err.code==11000){
        //duplicate.  index is doing its job
        resolve(0);
      }
      reject(err);
    }
  })
}

module.exports.readObjects = function (client, params){
  return new Promise( (resolve, reject) => {
    client.db(roverDbName)
      .collection(params.type)
      .find(params.query)
      .toArray()
      .then( (resp) => {
      resolve(resp);
    }).catch( (err) => {
      reject(err);
    })
  })
}

module.exports.aggregateObjects = function(client, params){
  return new Promise( (resolve, reject) => {
    client.db(roverDbName)
      .collection(params.type)
      .aggregate(params.stages)
      .toArray()
      .then( (resp) => {
      resolve(resp);
    }).catch( (err) => {
      reject(err);
    })
  })
}
