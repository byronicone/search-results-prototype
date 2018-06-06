const fs = require('fs');
const parse = require('csv-parse');

module.exports.loadReviews = function(callback){
  let reviews = [];

  let readStream = fs.createReadStream('reviews.csv');

  let parser = parse({delimiter: ',', columns: true});
  readStream.pipe(parser);

  parser.on('readable', function(){
    while(record = parser.read()){
      reviews.push(record);
    }
  })
  .on('end', () => {
    callback(reviews);
  })
}

