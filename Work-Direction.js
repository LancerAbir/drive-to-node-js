/**
 * * text
 * ! text
 * ? text
 * TODO: text
 * @param myParam



* !  ~~~˚∆˚~~~  Node JS Work Direction ~~~˚∆˚~~~


*! 01 Folder Create ••••••••••§§§••••••••••
---------------------------------------------------------------------------------

** api --> controller,
** api --> routes,
** config,
** controllers,
** middleware,
** models,
** routes,
** utils,
** validator,
** public -->  images,
** public -->  scripts,
** public -->  styles,
** public -->  uploads,
** views -->  pages,
** views -->  partials,



*!  ••••••••••§§§••••••••••  02 app.js Setup  ••••••••••§§§••••••••••
---------------------------------------------------------------------------------
**  ~~~˚∆˚~~~ Import Express, Router, Third party Middleware  ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ Express Bind in APP   ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ EJS Set  ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ Custom Middleware   ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ All Middleware   ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ Router Bind in APP   ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ Home Router   ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ Server On PORT || 5500  ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ MongoDB  ~~~˚∆˚~~~



*! ••••••••••§§§••••••••••  03 Model Create ••••••••••§§§••••••••••
---------------------------------------------------------------------------------

* TODO: যেই সব আইটেম এর নিজস্ব আলাদা আলাদা id থাকবে তাদের জন্য Model Create করতে হবে।
* TODO: কোন Model এর সাথে কোন Model এর relation তা খেয়াল রাখতে হবে।
* TODO: common কিছু Model Name: User Model, Profile Model, Post Model, Comment Model



*! ••••••••••§§§••••••••••  04 EJS / React Work ••••••••••§§§••••••••••
---------------------------------------------------------------------------------

**  ~~~˚∆˚~~~ pages --> file.ejs   ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ partials --> file.ejs  ~~~˚∆˚~~~



*! ••••••••••§§§••••••••••  05 Create Route & Controller ••••••••••§§§••••••••••
---------------------------------------------------------------------------------

**   ~~~˚∆˚~~~  Auth Route  ~~~˚∆˚~~~
**   ~~~˚∆˚~~~  Auth Controller  ~~~˚∆˚~~~
**   ~~~˚∆˚~~~  password hash in Bcrypt  ~~~˚∆˚~~~



*! ••••••••••§§§••••••••••  06 Validation ••••••••••§§§••••••••••(1. check --> validator fontEnd er name="", 2.validationResult = Error)
---------------------------------------------------------------------------------
npm install --save express-validator

** import -->  const { body, validationResult } = require('express-validator')
** body --> built-In validation
    [
        body('input name -> username ')
            .not()
            .isEmpty()
                .withMessage(`Username can not be Empty`),
            .isLength({max: 15})
                .withMessage(`Username can not be greater then 15 character`)
                .trim(),
        body('input name -> email')
            .isEmail()
                .withMessage(`Please Provide a valid Email ID`),
    ]
** check --> Custom validation
    [
        body('input name -> password').custom(value => {
            if(value.length > 5) {
                throw new Error(`Password Must be Greater Then 5 Characters`)
            }
            return true
        }),
        body('input name -> confirmPassword').custom((value, {req}) => {
            if(value != req.body.password){
                throw new Error(`Password Dose not Match`)
            }
            return true
        })
    ]
** Sanitization --> (incoming value কে modify করা) --> trim(), normalizeEmail() etc
    .trim()
    .normalizeEmail()

** errors --> { controller file }
//! ~~~˚∆˚~~~ import Validator Error -> validationResult ~~~˚∆˚~~~
const { validationResult } = require('express-validator')

//! ~~~˚∆˚~~~ import Error Formatter at Utils  ~~~˚∆˚~~~ validatorErrorFormatter file --> module.exports = error => error.msg
const errorFormatter = require('../utils/validatorErrorFormatter')


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
    }

** Font End এ visible Error Message
1. input class=" <%= error.username ? 'is-invalid' : '' %>"
2. <div class="invalid-feedback">
        <%= error.username && error.username %>
    </div>
3. value="<%= value.username && value.username %>"



*! ••••••••••§§§••••••••••  07 Session & Cookie ••••••••••§§§••••••••••
---------------------------------------------------------------------------------
npm i express-session
npm i connect-mongodb-session


** app.js
1. const session = require('express-session')
2. const middleware = [
    session({
        secret: process.env.SECRET_KEY || 'LAncer',
        resave: false,
        saveUninitialized: false,
        cookie:
        {
            // secure: true,
            // maxAge: 1000 * 60 * 3 * 60
        }
    })
]
** Controller File
1. Session Set
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

** DataBase e Session Set
    ** app.js
    1.  const MongoDBStore = require('connect-mongodb-session')(session);
    2.  const MONGODB_URI = 'mongodb+srv://MongoSuper5:MongoSuper5@cluster0-0evig.mongodb.net/stackProject?retryWrites=true&w=majority'
        const store = new MongoDBStore({
            uri: MONGODB_URI,
            collection: 'sessions',
            expires: 1000 * 60 * 60 * 2
        });
    3. store add in middleware
        const middleware = [
                store: store
            })
        ]
** Check User Login করা আছে কি না
    ** middleware folder -> authMiddleware.js file
        //! ~~~˚∆˚~~~ import User Model  ~~~˚∆˚~~~
        const User = require('../models/User')

        exports.bindUserWithRequest = async () => {
            return (req, res, next) => {
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
    ** app.js
        1. const { bindUserWithRequest } = require('./middleware/authMiddleware')
        2. const middleware = [
                bindUserWithRequest()
            ]

** Set Local Cookies In Browser Access in Front-End
    ** middleware folder -> setLocals.js file
    module.exports = () => {
        return (req, res, next) => {
            res.locals.user = req.user
            res.locals.isLoggedIn = req.session.isLoggedIn

            next()
        }
    }
    ** app.js
    1. const setLocals = require('./middleware/setLocals')
    2. const middleware = [
            setLocals()
        ]

** user login করা ছাড়া DataBase Site Access না পাওয়ার system
1. create dashboardRoute.js, dashboardController.js
2. ** middleware folder -> authMiddleware.js file এ isAuthenticated set
    exports.isAuthenticated = (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect('/auth/login')
        }
        next()
    }
3. যেই যেই route এ user login ছাড়া Access করেতে পারার না সেই route এ middleware হিসেবে isAuthenticated add করে দিলেই user login ছাড়া সেই পেইজ এ Access করেতে পারার না

** logout system add
1. navbar.ejs file --> isLoggedIn in coming form setLocals.js
    <% if (isLoggedIn) { %>

        <li class="nav-item">
            <a class="nav-link text-white" href="/auth/logout">logout</a>
        </li>

    <% } else  { %>

        <li class="nav-item">
            <a class="nav-link text-white" href="/auth/signup">signUp</a>
        </li>
        <li class=" nav-item">
            <a class="nav-link text-white" href="/auth/login">login</a>
        </li>

    <% } %>
2. authController.js --> logout controller set
    req.session.destroy(error => {
        if (error) {
            console.log(error)
            return next(error)
        }
        return res.render('pages/auth/login', { title: "Login Account", error: {} })
    })

** user login করা অবস্তায় কোন কোন পেইজ এ Access পাবে না
1. ** middleware folder -> authMiddleware.js file এ isUnAuthenticated set
    exports.isUnAuthenticated = (req, res, next) => {
        if (req.session.isLoggedIn) {
            return res.redirect('/dashboard/dashboard')
        }
        next()
    }
2. যেই যেই route এ user login করা অবস্তায় যে সকল পেইজ এ Access পাবে না সেই route এ middleware হিসেবে isUnAuthenticated add করে দিয়ে হবে



*! ••••••••••§§§••••••••••  08 Alert & Flash ••••••••••§§§••••••••••
* TODO: Session ছাড়া connect-flash কাজ করবে না
---------------------------------------------------------------------------------
npm i connect-flash



















 *
*/
