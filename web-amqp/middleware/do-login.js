let def = require('../../default-values')

function doLogin (req, res) {
  res.cookie('token', Date.now())
  res.cookie('nickname', req.body.nickname)
  res.cookie('username', req.body.username ? req.body.username : def.userName(req.body.nickname))
  res.cookie('channel', req.body.channel ? req.body.channel : def.channel)
  res.cookie('server', req.body.server ? req.body.server : def.server)
  res.redirect('/')
}

module.exports = function () {
  return doLogin
}