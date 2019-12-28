const path = require('path')
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const upload = require('express-fileupload')
const mongoDBConnecion = require('./controllers/database') 
const { select, generateDate } = require('./helpers/handlebars-helpers')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(upload())
app.use(session({
    secret: 'alaketych',
    resave: true,
    saveUninitialized: true,
  }))
app.use(flash())

app.use((request, response, next) => {
  response.locals.success_message = request.flash('success_message')
  next()
})

const home  = require('./routes/home/index')
const admin = require('./routes/admin/index')
const posts = require('./routes/admin/posts')
const categories = require('./routes/admin/categories')

app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', expressHandlebars({defaultLayout: 'homeLayout', helpers: { select: select,
                                                                                    generateDate: generateDate }}))
app.set('view engine', 'handlebars')

app.use('/', home)
app.use('/admin', admin)
app.use('/admin/posts', posts)
app.use('/admin/categories', categories)

app.listen(8000, () => {
    console.log('Server is working on the port 8000.')
})