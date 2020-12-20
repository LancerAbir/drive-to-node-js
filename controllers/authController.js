/**
**   ~~~˚∆˚~~~  Auth Controller  ~~~˚∆˚~~~ 
*/


//! ~~~˚∆˚~~~ import User Model ~~~˚∆˚~~~
const User = require('../models/User');

//! ~~~˚∆˚~~~ import Bcrypt Hash Password  ~~~˚∆˚~~~
const bcrypt = require('bcrypt')

//! ~~~˚∆˚~~~ import Validator Error -> validationResult ~~~˚∆˚~~~
const { validationResult } = require('express-validator')

//! ~~~˚∆˚~~~ import Error Formatter at Utils  ~~~˚∆˚~~~
const errorFormatter = require('../utils/validatorErrorFormatter')



exports.signUpGetController = (req, res, next) => {
    res.render('pages/auth/signup', { title: "Create a New Account", error: {}, value: {} })
}

exports.signUpPostController = async (req, res, next) => {


    let { username, email, password } = req.body

    //! ~~~˚∆˚~~~ Validation Error Format With Mapped ~~~˚∆˚~~~
    let errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        // return console.log(errors.mapped());
        res.render('pages/auth/signup',
            {
                title: "Create a New Account",
                error: errors.mapped(),
                value: {
                    username, email
                }
            })
    } else {


        try {
            //! ~~~˚∆˚~~~ bcrypt hash password ~~~˚∆˚~~~
            let hashPassword = await bcrypt.hash(password, 11)

            //! ~~~˚∆˚~~~ Model এর Object Data সাথে FontEnd এর Object Data Bind করা ~~~˚∆˚~~~
            let user = new User({
                username,
                email,
                password: hashPassword
            })

            //! ~~~˚∆˚~~~ Created user Data Save in Database  ~~~˚∆˚~~~
            let createdUser = await user.save()
            console.log('User Created Successfully', createdUser);

            //! ~~~˚∆˚~~~ user Create হওয়ার পর কোন route এ যাবে ~~~˚∆˚~~~
            res.render('pages/auth/signup', { title: "Successfully Created a New User", error: {}, value: {} })

        } catch (error) {
            console.log(error)
            next(error)
        }


        res.render('pages/auth/signup', { title: "Create a A a New Account", error: {}, value: {} })
    }
}



exports.loginGetController = (req, res, next) => {
    console.log('user is', req.session.user);
    console.log('isLoggedIn is', req.session.isLoggedIn);
    console.log('session', req.session);
    res.render('pages/auth/login', { title: "Login Account", error: {} })
}



exports.loginPostController = async (req, res, next) => {

    let { email, password } = req.body

    //! ~~~˚∆˚~~~ Validation Error Format With Mapped ~~~˚∆˚~~~
    let errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        // return console.log(errors.mapped());
        res.render('pages/auth/login',
            {
                title: "Login to your Account",
                error: errors.mapped()
            })
    }

    try {
        //! ~~~˚∆˚~~~ User Model থেকে email কে find করা ~~~˚∆˚~~~
        let user = await User.findOne({ email })

        //! ~~~˚∆˚~~~ যদি email match না হয় তাহলে message show করবে ~~~˚∆˚~~~
        if (!user) {
            return res.json({
                message: 'Invalid Credential'
            })
        }

        //!  ~~~˚∆˚~~~ bcrypt.compare এর মাধ্যমে input দেয়া password এর সাথে user এর password match করবে ~~~˚∆˚~~~
        let match = await bcrypt.compare(password, user.password)

        //! ~~~˚∆˚~~~ যদি password match না হয় তাহলে message show করবে ~~~˚∆˚~~~
        if (!match) {
            return res.json({
                message: 'Invalid Credential'
            })
        }


        //! ~~~˚∆˚~~~ Session Set ~~~˚∆˚~~~
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(error => {
            if (error) {
                console.log(error);
                return next(error)
            }
            //! ~~~˚∆˚~~~ user Login হওয়ার পর কোন route এ যাবে ~~~˚∆˚~~~
            res.render('pages/dashboard/dashboard', { title: "Your Dashboard", error: {} })
        })


    } catch (error) {
        console.log(error)
        next(error)
    }

}



exports.logoutController = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error)
            return next(error)
        }
        return res.render('pages/auth/login', { title: "Login Account", error: {} })
    })
}
