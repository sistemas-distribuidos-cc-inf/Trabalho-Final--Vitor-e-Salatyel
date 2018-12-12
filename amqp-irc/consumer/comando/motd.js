let event = require('../../../common/appEvents')
let queue = require('../../../common/amqp/queues-name')
let AmqpReply = require('../../model/AmqpReply')

function motd (comando, proxy) {
  proxy.onNewMotd(onNewMotd(proxy))
  proxy.clienteIRC.send('motd')
}

function onNewMotd(proxy) {
  return function (motd) {
    new AmqpReply()
      .queue(queue.processar + proxy.info.id)
      .event(event.message)
      .message(motd)
      .server(proxy.info.servidor)
      .send()
  }
}

module.exports = motd