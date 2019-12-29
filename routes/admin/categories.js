const express = require('express')
const Category = require('../../models/Category')
const router = express.Router()

router.all('/*', (request, response, next) => {
    request.app.locals.layout = 'adminLayout'
    next();
})

router.get('/', (request, response) => {
    Category.find({}).then(categories => {
        response.render('admin/categories/index', {categories: categories})
    })
})

router.post('/create', (request, response) => {
    const newCategory = Category({
        name: request.body.name
    })

    newCategory.save().then(savedCategory => {
        request.flash('success_message', `New category ${savedCategory.name}'s been created.`)
        response.redirect('/admin/categories/')
    })
})

router.get('/edit/:id', (request, response) => {
    Category.findOne({ _id: request.params.id }).then(category => {
        response.render('admin/categories/edit', {category: category})
    })
})

router.put('/edit/:id', (request, response) => {
    Category.findOne({ _id: request.params.id }).then(category => {
        category.name = request.body.name
        category.save().then(savedCategory => {
            request.flash('success_message', `Changes to the category ${category.name}'s been saved.`)
            response.redirect('/admin/categories')
        })     
    })
})

router.delete('/:id', (request, response) => {
    Category.remove({ _id: request.params.id }).then(deletedCategory => {
        request.flash('success_message', 'Category was deleted completely')
        response.redirect('/admin/categories')
    })
})
module.exports = router