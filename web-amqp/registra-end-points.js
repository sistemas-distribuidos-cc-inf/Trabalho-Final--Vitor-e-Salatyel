let endPoints = require('./end-points')

function registraEndPoints (app, sockets) {
  endPoints.forEach(function (endPoint) {
    app[endPoint.method](endPoint.url, function (req, res) {
      endPoint.controller(req, res, sockets)
    })
  })
}

module.exports = registraEndPoints
