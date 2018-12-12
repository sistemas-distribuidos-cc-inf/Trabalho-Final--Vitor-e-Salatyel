let queue = require('../../../common/amqp/queues-name')
let event = require('../../../common/appEvents')
let AmqpReply = require('../../model/AmqpReply')

//TODO revisar por que não está fechando ABA apos execução do comando
function partall(comando, proxy) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.partall)
    .send()
}

module.exports = partall