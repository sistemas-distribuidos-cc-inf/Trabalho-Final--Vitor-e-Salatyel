let LOGGER = require('../../common/logger')
let mensagem = require('../util/mensagens')
let Amqp = require('../../common/amqp/interface-amqp').interface
let amqp = new Amqp().connect()

function AmqpReply () {
  let that = this
  this._queue = null
  this._event = null
  this._message = null
  this._nickname = null
  this._channel = null
  this._server = null

  this.queue = function (queue) {
    that._queue = queue
    return that
  }

  this.event = function (event) {
    that._event = event
    return that
  }

  this.messageByCode = function (code) {
    if (!mensagem[code]) {
      LOGGER.log('error','[' + code + ']' + ' Erro desconhecido, por favor contate o administrador.' )
      that._message = 'Erro desconhecido, por favor contate o administrador.'
    } else {
      that._message = mensagem[code]
    }
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
      event: that._event,
      message: that._message,
      timestamp: Date.now(),
      nickname: that._nickname,
      channel: that._channel,
      server: that._server
    }
  }

  this.send = function () {
    if (!amqp) {
      throw new Error('[amqp] O amqp ainda não foi inicializado')
    }
    amqp.publish(that._queue, that.getReply())
  }

  return this
}

module.exports = AmqpReply