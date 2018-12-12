let event = require('../../common/appEvents')
let queueName = require('../../common/amqp/queues-name')
let AmqpNotificacao = require('../model/AmqpNotificacao')

function onNewError (token) {
  return function (message) {
    new AmqpNotificacao()
      .queue(queueName.notify)
      .token(token)
      .event(event.error)
      .messageByCode(message.rawCommand)
      .logError(message)
      .notify()
  }
}

module.exports = onNewError