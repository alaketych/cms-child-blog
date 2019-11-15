const express = require('express')
const router = express.Router()

router.all('/*', (request, response, next) => {
    request.app.locals.layout = 'adminLayout'
    next();
})

router.get('/', (request, response) => {
    response.send('it works, boooj!')
})

router.get('/create', (request, response) => {
    response.render('admin/posts/create')
})

module.exports = router