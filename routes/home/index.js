const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const Post = require('../../models/Post')
const Category = require('../../models/Category')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy

router.all('/*', (request, response, next) => {
    request.app.locals.layout = 'homeLayout'
    next();
})

const escapeRegex = text => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

router.get('/', (request, response) => {
    response.render('./home/index')
})

router.get('/articles', (request, response) => {
    let errors = []
    if(request.query.search) {
        const regex = new RegExp(escape(request.query.search), 'gi')

        Post.find({ title: regex }).then(posts => {
            Category.find({}).then(categories => {
                response.render('./home/articles', {posts: posts, categories: categories})
            })
        })
    } 
    else {
        errors.push({
            message: 'No matches found.'
        })
    }
})

router.get('/login', (request, response) => {
    response.render('./home/login')
})

passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email: email}).then(user => {
        if(!user) return done(null, false, {message: 'User with entered email was not found. Try another one.'})
    
        bcrypt.compare(password, user.password, (error, matched) => {
            if(error) return error

            if(matched) {
                return done(null, user)
            }
            else {
                return done(null, false, {message: 'Something went wrong, probably password is incorrect'})
            }
        })
    })
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user)
    })
})

router.post('/login', (request, response) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    }) (request, response)
})

router.get('/logout', (request, response) => {
    request.logOut()
    response.redirect('/')
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

        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error, hash) => {
                newUser.password = hash


                newUser.save().then(savedUser => {
                    request.flash('success_message', 'You have just registered yourself. Put your login and password to enter.')
                    response.redirect('/login')      
                })
            })
        })
    }
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