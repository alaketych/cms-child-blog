const express = require('express')
const router = express.Router()
const Post = require('../../models/Post')
const moment = require('moment')
const { isEmpty } = require('../../helpers/upload-helper')

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
    let errors = []

    if(!request.body.title) {
        errors.push({
            message: 'Title is required!'
        })
    }

    if(!request.body.body) {
        errors.push({
            message: 'Description should be filled.'
        })
    }
    
    if(errors.length > 0) {
        response.render('admin/posts/create', {
            errors: errors
        })
    }
    else {
        let filename = ''

        if(!isEmpty(request.files)) {
            let file = request.files.file
                filename = Date.now() + '-' + file.name
            let dirUploads = './public/uploads/'
        
            file.mv(dirUploads + filename, error => {
                if(error) console.log('Uploading file was not success...')          
            })

            console.log('Media file was uploaded')
        }
        else {
            console.log('Post does not contain any of media files')
        }
        
        let allowComments = true;

        (request.body.allowComments) ? allowComments = true : allowComments = false

        const newPost = new Post({
            title:          request.body.title,
            status:         request.body.status,
            allowComments:  allowComments,
            body:           request.body.body,
            file:           filename
        })

        newPost.save().then(savedPost => {
            request.flash('success_message', `Post "${savedPost.title}" was published successfully`)
            

            response.redirect('/admin/posts')
        }).catch(error => {
            console.log('could not save post.')
        })

        console.log(request.body)
    }
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

        if(!isEmpty(request.files)) {
            let file = request.files.file
                filename = Date.now() + '-' + file.name
            let dirUploads = './public/uploads/'
            post.file = filename
        
            file.mv(dirUploads + filename, error => {
                if(error) console.log('Uploading file was not success...')          
            })

            console.log('Media file was uploaded')
        }
    
        post.save().then(updatedPost => {
            request.flash('success_message', `Post "${updatedPost.title}" was edited successfully`)

            response.redirect('/admin/posts')
        })
    })
})

router.delete('/:id', (request, response) => {
    Post.remove({ _id: request.params.id }).then(deletedPost => {
        request.flash('success_message', 'Post was deleted completely')
        response.redirect('/admin/posts')
    })
})

module.exports = router