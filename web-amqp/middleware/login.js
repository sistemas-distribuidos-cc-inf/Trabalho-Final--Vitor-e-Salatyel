let path = require('path')

function login (req, res, next) {
  res.sendFile(path.join(__dirname, '../../web-app/login.html'))
}

module.exports = function () {
  return login
}