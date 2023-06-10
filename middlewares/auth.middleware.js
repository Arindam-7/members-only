function userAvailableInTemplate(req, res, next) {
    res.locals.user = req.user
    return next()
}
  
function userMustBeAuthenticated(req, res, next) {
    if (req.user) return next()
    return res.redirect('/login')
}
  
function userMustBeNotAuthenticated(req, res, next) {
    if (!req.user) return next()
    return res.redirect('/posts')
}
  
module.exports = {
    userAvailableInTemplate,
    userMustBeAuthenticated,
    userMustBeNotAuthenticated,
}