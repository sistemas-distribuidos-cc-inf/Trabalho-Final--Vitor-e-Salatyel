let path = require('path')

function ServerChange (req, res) {
  res.sendFile(path.join(__dirname, '../../web-app/ServerChange.html'))
}

module.exports = {
  method: 'get',
  url: '/server-change',
  controller: ServerChange
}