/**
**  ~~~˚∆˚~~~  Import Express, Router, Third party Middleware --> Start  ~~~˚∆˚~~~ 
*/
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);

// Route
const authRoutes = require('./routes/authRoute')
const dashboardRoutes = require('./routes/dashboardRoute')

// PlayGround 

// Middleware
const { bindUserWithRequest } = require('./middleware/authMiddleware')
const setLocals = require('./middleware/setLocals')


/**
*!  ~~~˚∆˚~~~  Import Express, Router, Third party Middleware --> End   ~~~˚∆˚~~~ 
*/




/**
**  ~~~˚∆˚~~~  MongoDB Session --> Start   ~~~˚∆˚~~~ 
*/
const MONGODB_URI = 'mongodb+srv://MongoSuper5:MongoSuper5@cluster0-0evig.mongodb.net/testOnly?retryWrites=true&w=majority'
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});
/**
*!  ~~~˚∆˚~~~  MongoDB Session --> End  ~~~˚∆˚~~~ 
*/



/**
**  ~~~˚∆˚~~~  Express Bind in APP   ~~~˚∆˚~~~ 
*/
const app = express()


/**
**  ~~~˚∆˚~~~ Setup View Engine --> EJS ~~~˚∆˚~~~ 
*/
app.set('view engine', 'ejs')
app.set('views', 'views')



/**
**  ~~~˚∆˚~~~  Custom Middleware --> Start  ~~~˚∆˚~~~ 
* TODO: TinyLogger Custom Middleware
*/
function customMiddleware(req, res, next) {
    if (req.url == '/about') {
        res.send('<h1>This Page Block by Admin</h1>')
    }
    next()
}


function tinyLogger() {
    return (req, res, next) => {
        console.log(`${req.method} - ${req.url}`)
        next()
    }
}
/**
*!   ~~~˚∆˚~~~  Custom Middleware --> END  ~~~˚∆˚~~~ 
*/



/**
**  ~~~˚∆˚~~~  All Middleware --> Start  ~~~˚∆˚~~~ 
* TODO: express.urlencoded() --> clint যেই data পাঠাক না কেন server তা format data হিসেবে received করতে পারবে
* TODO: express.json() --> json data received করতে পারবে
* TODO: express.static('public') --> public folder টা add করে দিতে হবে, তানাহলে  public folder এর css, img, upload কোন কিছুই কাজ করবে না ।
* TODO: session --> secret: secret key, resave: বার বার save হবে কি না, cookie: cookie কতক্ষণ থাকবে, store: session data store in DataBase
* TODO: bindUserWithRequest() --> user login করা আছে কিনা তা check করার জন্য
* TODO: setLocals() --> Set Local Cookies In Browser for FrontEnd
*/
const middleware = [
    customMiddleware,
    tinyLogger(),
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'LAncer',
        resave: false,
        saveUninitialized: false,
        cookie:
        {
            // secure: true,
            // maxAge: 1000 * 60 * 3 * 60
        },
        store: store,
    }),
    bindUserWithRequest(),
    setLocals()
]
app.use(middleware)
/**
*!   ~~~˚∆˚~~~ All Middleware --> END  ~~~˚∆˚~~~
*/


/**
**  ~~~˚∆˚~~~ Router Bind in APP --> Start  ~~~˚∆˚~~~
*/
app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)







/**
**  ~~~˚∆˚~~~ Home Router / Root Router --> Start  ~~~˚∆˚~~~
*/
app.get('/about', (req, res) => {
    res.send('<h1> Hello i am About page </h1>')
})

app.get('/help', (req, res) => {
    res.send('<h1> Hello i am Help page </h1>')
})

app.get('/', (req, res) => {
    res.send('<h1> Hello i am Home page </h1>')
})

app.get('*', (req, res) => {
    res.send('<h1> 404 page </h1>')
})
/**
*!   ~~~˚∆˚~~~ Home Router / Root Router  --> End  ~~~˚∆˚~~~
*/



/**
**  ~~~˚∆˚~~~ Server On PORT || 5500--> Start  ~~~˚∆˚~~~
**  ~~~˚∆˚~~~ MongoDB Server Connected  ~~~˚∆˚~~~
** MongoDB Url --> 'mongodb+srv://MongoSuper5:MongoSuper5@cluster0-0evig.mongodb.net/testOnly?retryWrites=true&w=majority'
*/
const PORT = process.env.PORT || 5500
mongoose.connect(MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => {
        console.log('Database Connected')
        app.listen(PORT, () => {
            console.log(`SERVER Is RUNNING On PORT ${PORT}`)
        })
    })
    .catch(error => {
        return console.log(error)
    })

/**
*!  ~~~˚∆˚~~~ Server On PORT || 5500--> End  ~~~˚∆˚~~~
*/


