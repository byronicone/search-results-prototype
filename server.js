require('dotenv').config();
const express = require('express');
const create = require('./data/create');
const database = require('./data/database');
const rankings = require('./search/rankings');
var st = require('./data/setup-teardown');
const app = express();
const port = process.env.PORT || 5000;
var shutdownInProgress = false;
var http_instance;


app.get('/api/sitters', async (req, res) => {
  let min = parseInt(req.query.minimumRating) || 0;
  let result = await rankings.getSitterRankings(min);
  res.send(result);
});

// when shutdown signal is received, do graceful shutdown
process.on( 'SIGINT', () => {
  if(!shutdownInProgress){
    shutdownInProgress=true;
    http_instance.close(shutdown);
  }
});

async function shutdown(){
  console.log( 'gracefully shutting down :)' );
  st.shutdown()
  .catch( (err) => {
    console.log('error occured during shutdown: ' + err);
  })
  .finally( (result) => {
    console.log('teardown complete!');
    process.exit();
  })
}

http_instance = app.listen(port);
