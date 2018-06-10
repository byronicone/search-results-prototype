require('dotenv').config();
var create = require('../data/create');

var DatabaseCleaner = require('database-cleaner');
var databaseCleaner = new DatabaseCleaner('mongodb');
var connect = require('mongodb').connect;


var env = process.env.NODE_ENV;
var url = process.env.ROVER_DB_URL;

var roverDbName = env == 'production' ? process.env.DATABASE_NAME : 'roverDbName'

module.exports.prepare = function(data){
  return new Promise( (resolve, reject) => {
    cleanDatabase()
      .then( () => indexDatabase()
      .then( () => primeDatabase(data)
      .then(resolve))
    ).catch(reject);
  })
}

module.exports.purge = function(){
  return new Promise( (resolve, reject) => {
        cleanDatabase().then(resolve).catch(reject);
    })
}


module.exports.shutdown = function(){
  return new Promise( (resolve, reject) => {
        shutdownServer().then(resolve).catch(reject);
    })
}

function indexDatabase(){
  return new Promise( (resolve, reject) => {
    connect(url, function(err, client) {
      if(err) reject(err);
      client.db(roverDbName)
        .collection('sitter')
        .ensureIndex( 'sitter', {unique: true}, function() {
          console.log('sitter index created');
          client.close().then(resolve).catch(reject);
        });
    });
  })
}

function cleanDatabase(){
  return new Promise( (resolve, reject) => {
    connect(url, function(err, client) {
      if(err) reject(err);
      databaseCleaner.clean(client.db(roverDbName), function() {
        console.log('database cleaned');
        client.close().then(resolve).catch(reject);
      });
    });
  })
}

function primeDatabase(data){
    return new Promise( async (resolve, reject) => {
      await create.insert(data);
      resolve();
    })
}

function shutdownServer() {
  return new Promise( (resolve, reject) => {
    connect(url, function(err, client) {
      if(err) reject(err);
      client.db('admin').command( {shutdown:1}, {}, function(err, result) {
        console.log('database shutdown!');
        client.close().then(resolve).catch(reject); //if we got an err, client is already closed
      });
    });

  })
}
