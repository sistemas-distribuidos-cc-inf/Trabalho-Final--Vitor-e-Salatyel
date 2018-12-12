let LOGGER = require('../../common/logger')

function SocketReply (socket) {
  let that = this
  this.socket = socket
  this._event = null
  this._message = null
  this._timestamp = null
  this._nickname = null
  this._channel = null
  this._server = null

  this.event = function (event) {
    that._event = event
    return that
  }

  this.message = function (message) {
    that._message = message
    return that
  }

  this.nickname = function (nickname) {
    that._nickname = nickname
    return that
  }

  this.channel = function (channel) {
    that._channel = channel
    return that
  }

  this.server = function (server) {
    that._server = server
    return that
  }

  this.logError = function (message) {
    LOGGER.log('error', '', message)
    return that
  }

  this.logWarn = function (message) {
    LOGGER.log('warn', '', message)
    return that
  }

  this.logInfo = function (message) {
    LOGGER.log('info', '', message)
    return that
  }

  this.toString = function () {
    return JSON.stringify(that.getReply())
  }

  this.getReply = function () {
    return {
      message: that._message,
      timestamp: that._timestamp ? that._timestamp : Date.now(),
      nickname: that._nickname,
      channel: that._channel,
      server: that._server
    }
  }

  this.fromAmqp = function (amqpReply) {
    that._event = amqpReply.event
    that._message = amqpReply.message
    that._timestamp = amqpReply.timestamp
    that._nickname = amqpReply.nickname
    that._channel = amqpReply.channel
    that._server = amqpReply.server
    return that
  }

  this.send = function () {
    that.socket.emit(that._event, that.getReply())
  }

  return this
}

module.exports = SocketReply