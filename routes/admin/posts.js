const express = require('express')
const router = express.Router()
const Post = require('../../models/Post')

router.all('/*', (request, response, next) => {
    request.app.locals.layout = 'adminLayout'
    next();
})

router.get('/', (request, response) => {
    Post.find({}).then(posts => {
        response.render('admin/posts', {posts: posts})
    });
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
        title:          request.body.title,
        status:         request.body.status,
        allowComments:  allowComments,
        body:           request.body.body
    })

    newPost.save().then(savedPost => {
        response.redirect('/admin/posts')
    }).catch(error => {
        console.log('could not save post.')
    })

    console.log(request.body)
})

router.get('/edit/:id', (request, response) => {
    Post.findOne({ _id: request.params.id }).then(post => {
        response.render('admin/posts/edit', {post: post})
    })
})

router.put('/edit/:id', (request, response) => {
    Post.findOne({ _id: request.params.id }).then(post => {
        (request.body.allowComments) ? allowComments = true : allowComments = false
        
        post.title          = request.body.title
        post.status         = request.body.status
        post.allowComments  = request.body.allowComments
        post.body           = request.body.body
    
        post.save().then(updatedPost => {
            response.redirect('/admin/posts')
        })
    })
})

module.exports = router