const express = require('express')
const router = express.Router()

router.all('/*', (request, response, next) => {
    request.app.locals.layout = 'adminLayout'
    next();
})

router.get('/', (request, response) => {
    response.render('./admin/index')
})

module.exports = router