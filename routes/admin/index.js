const express = require('express')
const { userAuthenticated } = require('../../helpers/auth-helper')
const router = express.Router()

router.all('/*', userAuthenticated, (request, response, next) => {
    request.app.locals.layout = 'adminLayout'
    next();
})

router.get('/', (request, response) => {
    response.render('./admin/index')
})

module.exports = router