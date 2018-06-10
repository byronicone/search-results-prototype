const dbName = process.env.DATABASE_NAME || 'rovertest';
const database = require('./database');
const schema = require('./schema');

module.exports.getSitters = function(){
  return new Promise( (resolve, reject) => {
    let params = {};
    params.type = schema.SITTER.TYPE;
    params.query = {};
    database.connectAndCallback(params, database.readObjects)
        .then( (sitters) => {
          resolve(sitters);
        }).catch( (err) => {
          reject(err);
        });
  })
}

module.exports.getVisits = function(minimumRating = 0){
  return new Promise( (resolve, reject) => {
    let params = {};
    params.type = schema.VISIT.TYPE
    sitterType = schema.SITTER.TYPE
    params.stages = [
      { $lookup:
        {
          from: sitterType,
          localField: sitterType,
          foreignField: sitterType,
          as: sitterType
        }
      },
      { $unwind: '$sitter'},
      { $group:
          { _id: `$sitter.sitter`,
            sitter_name: { $first: `$sitter.sitter` },
            sitter_image: { $first: `$sitter.sitter_image` },
            sitter_rating_avg: { $avg: '$rating' },

            sitter_rating_count: { $sum: 1 }
          }
      },
      { $match: {sitter_rating_avg: {$gte: minimumRating}}},
      { $sort: { sitter_rating_avg: -1 } }
      ]

    database.connectAndCallback(params, database.aggregateObjects)
      .then( (visits) => {
        resolve(visits);
      })
      .catch( (err) => {
        reject(err);
      });
  })
}
