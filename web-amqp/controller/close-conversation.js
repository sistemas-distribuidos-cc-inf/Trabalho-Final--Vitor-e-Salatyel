let queue = require('../../common/amqp/queues-name')
let Comando = require('../../common/amqp/ComandoAmqp')
let SocketReply = require('../model/SocketReply')

function closeConversation (req, res, sockets) {
  new Comando()
    .queue(queue.fecharConversa)
    .token(req.cookies.token)
    .dados(req.body)
    .publish()
    .onReply((replyMsg) => reply(sockets[req.cookies.token], replyMsg))
}

function reply (socket, message) {
  new SocketReply(socket)
    .fromAmqp(message)
    .send()
}

module.exports = {
  method: 'post',
  url: '/close-conversation',
  controller: closeConversation
}