/**
**   ~~~˚∆˚~~~  Dashboard Controller  ~~~˚∆˚~~~ 
*/



exports.dashboardGetController = (req, res, next) => {
    res.render('pages/dashboard/dashboard', { title: "Welcome to Dashboard" })
}