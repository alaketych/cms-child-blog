const express = require('express')
const router = express.Router()
const Post = require('../../models/Post')

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

router.get('/posts', (request, response) => {
    response.send('it works')
})

router.post('/create', (request, response) => {
    let allowComments = true;

    (request.body.allowComments) ? allowComments = true : allowComments = false

    const newPost = new Post({
        title: request.body.title,
        status: request.body.status,
        allowComments: allowComments,
        body: request.body.body
    })

    newPost.save().then(savedPost => {
        response.redirect('/admin/posts')
    }).catch(error => {
        console.log('could not save post.')
    })

    console.log(request.body)
})

module.exports = router