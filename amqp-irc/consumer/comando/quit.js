let queue = require('../../../common/amqp/queues-name')
let event = require('../../../common/appEvents')
let AmqpReply = require('../../model/AmqpReply')

function quit (comando, proxy) {
  let mensagem = comando.params.split(' ')[0].trim()
  let quitmessage = 'User ' + proxy.info.nickname + ' saiu do IRC: ' + mensagem

  proxy.clienteIRC.send('quit', quitmessage)

  replyQuit(proxy)
}

function replyQuit (proxy, quitmessage) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.quit)
    .message(quitmessage)
    .nickname(proxy.info.nickname)
    .send()
}

module.exports = quit