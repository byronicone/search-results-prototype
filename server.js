const dotenv = require('dotenv').config();
const express = require('express');
const create = require('./data/create');
const fl = require('./util/file_loader');
const database = require('./data/database');
const rankings = require('./search/rankings');
const app = express();
const port = process.env.PORT || 5000;
var http_instance;

function initDatabase(){
  fl.loadReviews( (reviews) => {
    create.connectAndInsert(reviews);
  })
}

app.get('/api/sitters', async (req, res) => {
  let result = await rankings.getSitterRatings();
  res.send(result);
});

// when shutdown signal is received, do graceful shutdown
process.on( 'SIGINT', () => {
  http_instance.close(shutdown);
});

async function shutdown(){
  console.log( 'gracefully shutting down :)' );
  await database.close();
  await database.dropDatabase();
  process.exit();
}

http_instance = app.listen(port, initDatabase);
