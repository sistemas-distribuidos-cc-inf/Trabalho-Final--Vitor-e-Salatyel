let LOGGER = require('../logger')
let queue = require('./queues-name')
let amqp = require('amqplib/callback_api')

let events = {
  connected: 'CONNECTED'
}

function interfaceAmqp () {
  let that = this
  this.ch = null
  this.callbacks = {}

  this.connect = connect
  this.on = on
  this.isConnected = isConnected
  this.publish = publish
  this.consume = consume

  let AMQP_ADDR = 'amqp://localhost'

  function connect () {
    amqp.connect(AMQP_ADDR, (err, conn) => {
      LOGGER.log('info', '[AMQP] Conexão AMQP estabelecida')
      conn.createChannel((err, ch) => {
        LOGGER.log('info', '[AMQP] Canal AMQP criado')

        that.ch = ch

        for (let name in queue) {
          that.ch.assertQueue(queue[name], {durable: false})
        }
        if (!!that.callbacks[events.connected]) {
          that.callbacks[events.connected]()
        }
      })
    })
    return that
  }

  function on (event, callback) {
    that.callbacks[event] = callback
  }

  function isConnected () {
    return !!that.ch
  }

  function publish (queueName, comando) {
    assertCh()
    that.ch.assertQueue(queueName, {durable: false})
    that.ch.sendToQueue(queueName, new Buffer(JSON.stringify(comando)))
    LOGGER.log('info', '[AMQP] Mensagem enviada para ' + queueName, comando)
  }

  function consume (queueName, callback) {
    assertCh()

    LOGGER.log('info', '[AMQP] Esperando mensagens de ' + queueName)
    that.ch.assertQueue(queueName, {durable: false})
    that.ch.consume(queueName, (mensagem) => {
      LOGGER.log('info', '[AMQP] Mensagem recebida de ' + queueName)
      if (callback) {
        callback(JSON.parse(mensagem.content.toString()))
      }
    }, {noAck: true})
  }

  function assertCh () {
    if (!that.ch) {
      throw new Error('[AMQP] O cannal ainda não foi criado')
    }
  }
}

module.exports.interface = interfaceAmqp

module.exports.events = events
