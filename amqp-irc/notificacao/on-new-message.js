let event = require('../../common/appEvents')
let queue = require('../../common/amqp/queues-name')
let AmqpNotificacao = require('../model/AmqpNotificacao')
let is = require('../util/validacao-irc')

function OnNewMessage (token) {
  return function (from, to, message, comando) {
    if (comando.command !== 'PRIVMSG')
      return

    if (is.channel(comando.args[0])) {
      enviaParaCanal(token, message, from, comando.args[0])
    } else {
      enviaParaUsuario(token, message, from)
    }
  }

  function enviaParaCanal (token, message, from, channel) {
    new AmqpNotificacao()
      .queue(queue.notify)
      .token(token)
      .event(event.message)
      .nickname(from)
      .channel(channel)
      .message(message)
      .notify()
  }

  function enviaParaUsuario (token, message, from) {
    new AmqpNotificacao()
      .queue(queue.notify)
      .token(token)
      .event(event.message)
      .nickname(from)
      .message(message)
      .notify()
  }
}

module.exports = OnNewMessage