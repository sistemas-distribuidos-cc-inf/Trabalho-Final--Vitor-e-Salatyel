let queueName = require('../../common/amqp/queues-name')
let event = require('../../common/appEvents')
let AmqpReply = require('../model/AmqpReply')

function fechaConversa (mensagem, proxies) {
  let proxy = proxies[mensagem.token]
  if (mensagem.dados.type === 'CHANNEL') {
    proxy.partChannel(mensagem.dados.name, () => replyChannelPart(proxy, mensagem.dados.name))
    removeChannelFromProxy(proxy, mensagem.dados.name)

  } else if (mensagem.type === 'USER') {
    replyCloseUser(proxy, mensagem.dados.name)
  }
}

function replyChannelPart (proxy, channel) {
  new AmqpReply()
    .queue(queueName.fecharConversa + proxy.info.id)
    .event(event.conversationClose)
    .channel(channel)
    .send()
}

function replyCloseUser() {
  new AmqpReply()
    .queue(queueName.fecharConversa + proxy.info.id)
    .event(event.conversationClose)
    .nickname(nickname)
    .send()
}

function removeChannelFromProxy (proxy, channelName) {
  let index = proxy.info.canais.indexOf(channelName)
  if (index !== -1) {
    proxy.info.canais.splice(index, 1)
  }
}

module.exports = {
  queue: queueName.fecharConversa,
  action: fechaConversa
}
