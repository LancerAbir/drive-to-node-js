/**
**  ~~~˚∆˚~~~  Set Local Cookies In Browser Access in Front-End  ~~~˚∆˚~~~
*/

module.exports = () => {
    return (req, res, next) => {
        res.locals.user = req.user
        res.locals.isLoggedIn = req.session.isLoggedIn

        next()
    }
}