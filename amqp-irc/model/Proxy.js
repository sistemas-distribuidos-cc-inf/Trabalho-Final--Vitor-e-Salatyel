let event = require('../../common/appEvents')
let ProxyInfo = require('./ProxyInfo')
let irc = require('irc')
let onNewMessage = require('../notificacao/on-new-message')
let onNewError = require('../notificacao/on-new-error')

function Proxy (props) {
  let that = this
  this.info = new ProxyInfo(props)
  this.clienteIRC = new irc.Client(this.info.servidor, this.info.nickname)

  this.onCreated = function (callback, joinCallback) {
    that.clienteIRC.addListener('registered', (message) => {
      that.joinChannel(props.channel, null, joinCallback)
      callback(message.args[1])
    })
  }

  this.disconnect = function (callback) {
    that.clienteIRC.disconnect(callback)
  }

  this.onNewMotd = function (callback) {
    that.clienteIRC.addListener('motd', callback)
  }

  this.joinChannel = function (channel, key, callback) {
    let channelName = montaNomeCanal(channel, key)
    this.clienteIRC.join(channelName, onJoinSucceed(this.info, channelName, callback))
  }

  this.partChannel = function (canal, callback) {
    this.clienteIRC.part(canal, callback)
  }

  this.clienteIRC.addListener('message', onNewMessage(this.info.id))

  this.clienteIRC.addListener('error', onNewError(this.info.id))

  return this
}

function montaNomeCanal (channel, key) {
  return channel + (!!key ? ' ' + key : '')
}

function onJoinSucceed (info, channelName, callback) {
  return function () {
    if (!contains(info.canais, channelName)) {
      info.canais.push(channelName)
      callback(event.joinChannel, channelName)
    } else {
      callback(event.warn, channelName)
    }
  }
}

function contains (canais, channelName) {
  return canais.indexOf(channelName) !== -1
}

module.exports = Proxy
