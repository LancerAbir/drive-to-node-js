//**         ~~~˚∆˚~~~  Login Validation  ~~~˚∆˚~~~        */

//*! import express validation 
const { body } = require('express-validator')

//*! import User Model
const User = require('../../models/User')



module.exports = [
    body('email')
        .not().isEmpty().withMessage(`Email Can Not be Empty`)
    ,
    body('password')
        .not().isEmpty().withMessage(`Password Can Not be Empty`)
]