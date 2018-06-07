const dotenv = require('dotenv').config();
const express = require('express');
const create = require('./data/create');
const fl = require('./util/file_loader');
const database = require('./data/database');
const rankings = require('./search/rankings');
const app = express();
const port = process.env.PORT || 5000;
const url = process.env.ROVER_DB_URL;
const dbName = process.env.DATABASE_NAME;
var http_instance;

function initDatabase(){
  fl.loadReviews( (reviews) => {
    database.config(url, dbName);
    create.connectAndInsert(reviews);
  })
}

app.get('/api/sitters', async (req, res) => {
  let result = await rankings.getSitterRankings();
  res.send(result);
});

// when shutdown signal is received, do graceful shutdown
process.on( 'SIGINT', () => {
  http_instance.close(shutdown);
});

async function shutdown(){
  console.log( 'gracefully shutting down :)' );
  await database.close();
  await database.dropDatabase(dbName);
  process.exit();
}

http_instance = app.listen(port, initDatabase);
