const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/cms',
                    { useNewUrlParser: true, useUnifiedTopology: true }).then(db => {
                        console.log('Database was connected.')
                }).catch( error => console.log(error))

const home  = require( './routes/home/index')
const admin = require('./routes/admin/index')
const posts = require('./routes/admin/posts')

app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', expressHandlebars({defaultLayout: 'homeLayout'}))
app.set('view engine', 'handlebars')

app.use('/', home)
app.use('/admin', admin)
app.use('/admin/posts', posts)

app.listen(8000, () => {
    console.log('Server is working on the port 8000.')
})