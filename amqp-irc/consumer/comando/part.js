let queue = require('../../../common/amqp/queues-name')
let event = require('../../../common/appEvents')
let AmqpReply = require('../../model/AmqpReply')


//TODO revisar por que não está fechando ABA apos execução do comando
function part(comando, proxy) {
  let channel = comando.params.split(' ')[0].trim()
  proxy.partChannel(channel, () => replyPart(proxy, channel))
}

function replyPart(proxy, channel) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.part)
    .message(channel)
    .send()
}

module.exports = part