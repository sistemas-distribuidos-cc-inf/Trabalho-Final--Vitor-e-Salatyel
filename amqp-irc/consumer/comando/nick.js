let queue = require('../../../common/amqp/queues-name')
let event = require('../../../common/appEvents')
let AmqpReply = require('../../model/AmqpReply')

function nick(comando, proxy) {
  let nickname = comando.params.split(' ')[0].trim()

  let nickmessage = 'Nick alterado de ' + proxy.info.nickname + ' para ' + nickname

  proxy.clienteIRC.send('nick', nickname)

  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.nick)
    .message(nickmessage)
    .nickname(nickname)
    .send()
}

module.exports = nick
