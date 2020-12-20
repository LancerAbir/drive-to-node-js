/**
**   ~~~˚∆˚~~~  Dashboard Route  ~~~˚∆˚~~~
*/

const router = require('express').Router()

//! ~~~˚∆˚~~~  User is Login --> Page Authenticated  ~~~˚∆˚~~~
const { isAuthenticated } = require('../middleware/authMiddleware')


const { dashboardGetController } = require('../controllers/dashboardController')

// example.com/auth/signup
router.get('/dashboard', isAuthenticated, dashboardGetController)


module.exports = router