let def = require('../../default-values')

function doServerChange (req, res) {
  res.cookie('server', req.body.server ? req.body.server : def.server)
  res.redirect('close.html')
}

module.exports = {
  method: 'post',
  url: '/server-change',
  controller: doServerChange
}