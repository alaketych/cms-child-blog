const mongoose = require('mongoose')

module.exports = mongoose.connect('mongodb://localhost:27017/cms',
                { useNewUrlParser: true,
                  useUnifiedTopology: true }).then(db => {
                      console.log('Database was connected.')
                }).catch( error => console.log(error))