let event = require('../../common/appEvents')
let queueName = require('../../common/amqp/queues-name')
let Proxy = require('../model/Proxy')
let AmqpReply = require('../model/AmqpReply')

function registraConexao (mensagem, proxies) {
  if (existProxy(proxies, mensagem.token))
    return

  let proxy = new Proxy(mensagem.dados)

  proxy.onCreated(
    onProxyCreated(proxy, () => proxies[mensagem.token] = proxy),
    onJoinedChannel(proxy))
}

function existProxy (proxies, token) {
  return !!proxies[token]
}

function onProxyCreated (proxy, assignProxy) {
  return function (welcome) {
    assignProxy()
    new AmqpReply()
      .queue(queueName.connection + proxy.info.id)
      .event(event.connected)
      .nickname(proxy.info.nickname)
      .server(proxy.info.servidor)
      .message(welcome)
      .send()
  }
}

function onJoinedChannel (proxy) {
  return function (event, channelName) {
    new AmqpReply()
      .queue(queueName.connection + proxy.info.id)
      .event(event)
      .message('Você está conectado no canal ' + channelName)
      .channel(channelName)
      .send()
  }
}

module.exports = {
  queue: queueName.connection,
  action: registraConexao
}