let queue = require('../../../common/amqp/queues-name')
let event = require('../../../common/appEvents')
let AmqpReply = require('../../model/AmqpReply')
let is = require('../../util/validacao-irc')

function join (comando, proxy) {
  if (isExitAll(comando)) {
    exitAll(proxy)
  } else {
    joinChannels(comando, proxy)
  }
}

function isExitAll (comando) {
  return comando.params.split(' ')[0] === '0'
}

function exitAll (proxy) {
  proxy.info.canais.forEach((nomeCanal) => {
    proxy.partChannel(nomeCanal, () => {
      replyExitAll(nomeCanal, proxy)
    })
  })
  proxy.info.canais = []
}

function replyExitAll (nomeCanal, proxy) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.conversationClose)
    .channel(nomeCanal)
    .send()
}

function joinChannels (comando, proxy) {
  let listaCanais = comando.params.split(' ')[0].split(',')
  let listaSenhas = comando.params.split(' ')[1]

  //se na lista de parâmetro exista senhas cria se um array para tal
  if (listaSenhas) {
    listaSenhas = comando.params.split(' ')[1].split(',')
  } else {
    listaSenhas = []
  }

  if (existePeloMenosUmNomeDeCanalInvalido(listaCanais)) {
    enviaWarn(comando, proxy)
  } else {
    for (let i = 0; i < listaCanais.length; i++) {
      if (listaSenhas.length < i)
        listaSenhas.push('')
      joinChannel(proxy, listaCanais[i], listaSenhas[i])
    }
  }
}

function existePeloMenosUmNomeDeCanalInvalido (listaCanais) {
  return listaCanais.some((canal) => !is.channel(canal))
}

function enviaWarn (comando, proxy) {
  new AmqpReply()
    .queue(queue.processar + proxy.info.id)
    .event(event.warn)
    .message('Parâmetros ínvalidos: ' + comando.params + ' : O nome de canal deve iniciar com #')
    .send()
}

function joinChannel (proxy, channel, key) {
  proxy.joinChannel(channel, key, onJoined(proxy))
}

function onJoined (proxy) {
  return function (event, channelName) {
    new AmqpReply()
      .queue(queue.processar + proxy.info.id)
      .event(event)
      .message('Você está conectado no canal ' + channelName)
      .channel(channelName)
      .send()
  }
}

module.exports = join