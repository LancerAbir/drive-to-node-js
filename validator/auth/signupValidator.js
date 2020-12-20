//**         ~~~˚∆˚~~~  SignUp Validation  ~~~˚∆˚~~~        */

//*! import express validation 
const { body } = require('express-validator')

//*! import User Model
const User = require('../../models/User')



module.exports = [
    body('username')
        .not()
        .isEmpty().withMessage(`User Name can not be empty`)
        .isLength({ min: 3, max: 15 }).withMessage(`Username Must Be Between 2 to 15 character`)
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject(`User Name Already Used`)
            }
        })
        .trim()
    ,
    body('email')
        .isEmail().withMessage(`Please Provide a Valid Email Address`)
        .custom(async email => {
            let emailID = await User.findOne({ email })
            if (emailID) {
                return Promise.reject(`Email Already Used`)
            }
        })
        .normalizeEmail()
    ,
    body('password')
        .isLength({ min: 5 }).withMessage(`Password Must Be Greater Then 5 character`)
    ,
    body('confirmPassword')
        .isLength({ min: 5 }).withMessage(`Password Must Be Greater Then 5 character`)
        .custom((conPassword, { req }) => {
            if (conPassword != req.body.password) {
                throw new Error(`Password Dose not Match`)
            }
            return true
        })
]