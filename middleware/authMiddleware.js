/**
**   ~~~˚∆˚~~~  Bind User For Session  ~~~˚∆˚~~~ 
*/

//! ~~~˚∆˚~~~ import User Model  ~~~˚∆˚~~~
const User = require('../models/User')


exports.bindUserWithRequest = () => {
    return async (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return next()
        }

        try {
            let user = await User.findById(req.session.user._id)
            req.user = user
            next()
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}


/**
**   ~~~˚∆˚~~~  Is Authenticated Page  ~~~˚∆˚~~~ 
*/
exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login')
    }
    next()
}


/**
**   ~~~˚∆˚~~~  Is Not Authenticated Page  ~~~˚∆˚~~~ 
*/
exports.isUnAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard/dashboard')
    }
    next()
}