/**
**   ~~~˚∆˚~~~  Auth Route  ~~~˚∆˚~~~ 
*/

const router = require('express').Router()

//*! ~~~˚∆˚~~~  SignUp Validation  ~~~˚∆˚~~~ */
const signupValidator = require('../validator/auth/signupValidator')

//*! ~~~˚∆˚~~~  Login Validation  ~~~˚∆˚~~~ */
const loginValidator = require('../validator/auth/loginValidator')

//! ~~~˚∆˚~~~  User is Not Login --> Page Un Authenticated  ~~~˚∆˚~~~
const { isUnAuthenticated } = require('../middleware/authMiddleware')


const {
    signUpGetController,
    signUpPostController,
    loginGetController,
    loginPostController,
    logoutController
} = require('../controllers/authController')






// example.com/auth/signup
router.get('/signup', isUnAuthenticated, signUpGetController)

// example.com/auth/signup
router.post('/signup', isUnAuthenticated, signupValidator, signUpPostController)

// example.com/auth/login
router.get('/login', isUnAuthenticated, loginGetController)

// example.com/auth/login
router.post('/login', isUnAuthenticated, loginValidator, loginPostController)

// example.com/auth/logout
router.get('/logout', logoutController)



module.exports = router