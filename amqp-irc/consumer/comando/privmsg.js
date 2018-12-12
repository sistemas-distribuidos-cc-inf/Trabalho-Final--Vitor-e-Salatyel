let queue = require('../../../common/amqp/queues-name')
let event = require('../../../common/appEvents')
let AmqpReply = require('../../model/AmqpReply')
let is = require('../../util/validacao-irc')

function privmsg (comando, proxy) {
  let destinos = comando.params.split(' ')[0].trim()
  let mensagem = comando.params.split(' ')[1]

  if (is.msgTarget(destinos)) {
    destinos.split(',').forEach(function (destino) {
      enviaMensagem(proxy, destino, mensagem)
    })
  } else {
    replyErro(proxy)
  }
}

function enviaMensagem (proxy, destino, mensagem) {
  if (!mensagem) {
    replyAlerta(proxy)
    return
  }

  proxy.clienteIRC.send('privmsg', destino, mensagem)
  replyMensagem(proxy, destino, mensagem)
}

function replyMensagem(proxy, destino, mensagem) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.message)
    .message(mensagem)
    .nickname(is.channel(destino) ? null : destino)
    .channel(is.channel(destino) ? destino : null)
    .send()
}

function replyAlerta(proxy) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.warn)
    .message('Por favor informe uma mensagem')
    .nickname(proxy.info.nickname)
    .send()
}

function replyErro (proxy) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.error)
    .message('Os destinatários informados estão inválidos!')
    .send()
}

module.exports = privmsg
