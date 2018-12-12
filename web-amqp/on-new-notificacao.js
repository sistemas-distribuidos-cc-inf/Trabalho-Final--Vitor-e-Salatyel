let LOGGER = require('../common/logger')
let Amqp = require('../common/amqp/interface-amqp').interface
let amqpEvent = require('../common/amqp/interface-amqp').events
let amqp = new Amqp().connect()
let queue = require('../common/amqp/queues-name')
let SocketReply = require('./model/SocketReply')

function onNewNotificacao (sockets) {
  amqp.on(amqpEvent.connected, () => {
    consumeNotifications(sockets)
  })
}

function consumeNotifications (sockets) {
  amqp.consume(queue.notify, (notificacao) => {
    LOGGER.log('info', 'Chegou uma nova notificação ', notificacao)
    if (!sockets[notificacao.token])
      return

    new SocketReply(sockets[notificacao.token])
      .fromAmqp(notificacao)
      .send()
  })
}

module.exports = onNewNotificacao