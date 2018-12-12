function auth (req, res, next) {
  if (isAuthenticated(req) || isStatic(req)) {
    next()
  } else {
    res.redirect('/login')
  }
}

function isAuthenticated (req) {
  return !!(req.cookies.token && req.cookies.nickname)
}

function isStatic (req) {
  return req.originalUrl.startsWith('/js') ||
    req.originalUrl.startsWith('/css') ||
    req.originalUrl.startsWith('/images') ||
    req.originalUrl.startsWith('/lib')
}

module.exports = function () {
  return auth
}
