let LOGGER = require('../common/logger')
let queue = require('../common/amqp/queues-name')
let Comando = require('../common/amqp/ComandoAmqp')
let SocketReply = require('./model/SocketReply')

function onConnection (sockets) {

  return (socket) => {
    registraSocket(sockets, socket, socket.request.headers.cookie)

    socket.on('disconnecting', function () {
      desconectaSocket(sockets, socket.request.headers.cookie)
    })
  }
}

function registraSocket (sockets, socket, cookies) {
  let that = this
  that.sockets = sockets

  if (isConnectado(sockets, cookies)) {
    return
  }

  conectarEmAmqpIrc(socket, cookies,
    () => {
		sockets[cookies.token] = socket
		LOGGER.log('info', 'IDs connectados: [' + Object.keys(that.sockets) + ']')
	})
}

function conectarEmAmqpIrc (socket, dados, addSocket) {
  new Comando()
    .queue(queue.connection)
    .token(dados.token)
    .dados(dados)
    .publish()
    .onReply(notifyPageFromAmqp(socket, addSocket))
}

function notifyPageFromAmqp(socket, addSocket) {
  let that = this;
  that.socket = socket;
  return (reply) => {
    addSocket()
    new SocketReply(that.socket)
      .fromAmqp(reply)
      .send()
  }
}

function desconectaSocket (sockets, cookies) {
  if (!isConnectado(sockets, cookies))
    return

  desconectarEmAmqpIrc(sockets, cookies)
}

function desconectarEmAmqpIrc (sockets, dados) {
  new Comando()
    .queue(queue.unconnection)
    .token(dados.token)
    .publish()
    .onReply(() => delete sockets[dados.token])
}

function isConnectado (sockets, cookies) {
  return !!sockets[cookies.token]
}

module.exports = onConnection
