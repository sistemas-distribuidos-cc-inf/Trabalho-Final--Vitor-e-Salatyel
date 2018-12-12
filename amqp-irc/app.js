let consumers = require('./consumers')
let amqpEvent = require('../common/amqp/interface-amqp').events
let Amqp = require('../common/amqp/interface-amqp').interface
let amqp = new Amqp().connect()
Telegraf = require('telegraf')

bot = new Telegraf('419969142:AAECOzjt91-83nymU0X82nWu0SKl6UUpYVY')
let proxies = {}

bot.startPolling()
bot.command('msg', (ctx) => {
  canal=(ctx.message.text.substr(ctx.message.text.indexOf(' ')+1)).split(',')[0]
  msg=(ctx.message.text.substr(ctx.message.text.indexOf(' ')+1)).split(',')[1]
  from=ctx.message.from.username;
  mensagem='Mensagem enviada pelo telegram'+'   '+from+': '+msg
  var data={}
  data.dados={}
  data.token=Object.keys(proxies)[0]
  data.dados.message=mensagem
  data.dados.destination={};
  data.dados.destination.name=canal
  data.dados.destination.type='CHANNEL'
  data.dados.from=from
amqp.publish('processarComando',data);

})
bot.command('channel', (ctx) => {
 pass=ctx.message.text.substr(ctx.message.text.indexOf(' ')+1)
 if(pass=='sd1-ec-2017-p3-g5')
 	ctx.reply('t.me/joinchat/AAAAAEszZfr9E7DU1d7vLg')
 else
 	ctx.reply('senha incorreta')
})
amqp.on(amqpEvent.connected, registraConsumers)

function registraConsumers () {
  consumers.forEach((consumer) => {
    amqp.consume(consumer.queue, (mensagem) => {
      consumer.action(mensagem, proxies)
    })
  })
}