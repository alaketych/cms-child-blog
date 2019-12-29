const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const Post = require('../../models/Post')
const Category = require('../../models/Category')

router.all('/*', (request, response, next) => {
    request.app.locals.layout = 'homeLayout'
    next();
})

router.get('/', (request, response) => {
    Post.find({}).then(posts => {
        Category.find({}).then(categories => {
            response.render('./home/index', {posts: posts, categories: categories})
        })
    })
})

router.get('/about', (request, response) => {
    response.render('./home/about')
})

router.get('/login', (request, response) => {
    response.render('./home/login')
})

router.get('/register', (request, response) => {
    response.render('./home/register')
})

router.post('/register', (request, response) => {
    let errors = []

    const newUser = new User ({
        firstName   : request.body.firstName,
        lastName    : request.body.lastName,
        email       : request.body.email,
        password    : request.body.password,
    })

    if(!request.body.firstName) {
        errors.push({
            message: 'Please enter your first name.'
        })
    }

    if(!request.body.lastName) {
        errors.push({
            message: 'Please enter your last name.'
        })
    }

    if(!request.body.email) {
        errors.push({
            message: 'Please enter your email'
        })
    }

    if(!request.body.password && !request.body.passwordConfirm) {
        errors.push({
            message: 'One of the passwords filds was not be entered.'
        })
    } 

    if(request.body.password !== request.body.passwordConfirm) {
        errors.push({
            message: 'Original passwords does not match with the confirmed password. Try again.'
        })
    }
    
    if(errors.length > 0) {
        response.render('home/register', {
            errors: errors
        })
    }
    else {
        const newUser = new User ({
            firstName   : request.body.firstName,
            lastName    : request.body.lastName,
            email       : request.body.email,
            password    : request.body.password,
        })

        newUser.save().then(savedUser => {
            response.send('User was successfully added.')      
        })}
})

router.get('/post/:id', (request, response) => {
    Post.findOne({_id: request.params.id})
        .then(post => {
            Category.findOne({}).then(categories => {
                response.render('home/post', {post: post, categories: categories})
            })
        })
})

module.exports = router