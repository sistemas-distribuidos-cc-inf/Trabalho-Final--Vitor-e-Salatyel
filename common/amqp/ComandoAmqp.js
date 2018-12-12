let Amqp = require('./interface-amqp').interface
let amqp = new Amqp().connect()

function ComandoAmqp () {
  let that = this
  this._queue = {}
  this._token = {}
  this._dados = {}

  this.queue = function (queue) {
    that._queue = queue
    return that
  }

  this.token = function (token) {
    that._token = token
    return that
  }

  this.dados = function (dados) {
    that._dados = dados
    return that
  }

  this.getComando = function () {
    return {
      token: that._token,
      dados: that._dados
    }
  }

  this.publish = function () {
    if (!amqp) {
      throw new Error('[amqp] O amqp ainda não foi inicializado')
    }
    amqp.publish(that._queue, that.getComando())
    return that;
  }

  this.onReply = function (callback) {
    if (!amqp) {
      throw new Error('[amqp] O amqp ainda não foi inicializado')
    }
    amqp.consume(that._queue + that._token, callback);
  }
}

module.exports = ComandoAmqp