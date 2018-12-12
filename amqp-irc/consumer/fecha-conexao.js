let queueName = require('../../common/amqp/queues-name')
let AmqpReply = require('../model/AmqpReply')

function fechaConexao (mensagem, proxies) {
  if (!existProxy(proxies, mensagem.token))
    return

  proxies[mensagem.token].disconnect(replyFechamento(mensagem, () => delete proxies[mensagem.token]))
}

function replyFechamento(mensagem, deleteProxy) {
  return function () {
    deleteProxy()
    new AmqpReply()
      .queue(queueName.unconnection + mensagem.token)
      .send()
  }
}

function existProxy (proxies, token) {
  return !!proxies[token]
}

module.exports = {
  queue: queueName.unconnection,
  action: fechaConexao
}