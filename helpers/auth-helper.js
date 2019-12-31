module.exports = {
    userAuthenticated: (request, response, next) => {
        if(request.isAuthenticated()) {
           return next()
        }

        response.redirect('/login')
    }
}