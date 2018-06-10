var st = require('../data/setup-teardown');
var fl = require('../util/file_loader');

st.purge().then( () => {
  fl.loadReviews().then((reviews) => {
    st.prepare(reviews).then(() => {
      console.log('mongodb created!')
      process.exit();
    })
  })
}).catch(console.log);


