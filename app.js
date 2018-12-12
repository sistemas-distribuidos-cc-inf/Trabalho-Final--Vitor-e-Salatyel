let LOGGER = require('./common/logger')
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let webSocketCookieParser = require('socket.io-cookie')
let http = require('http').Server(app)
let webSocket = require('socket.io')(http)

let sockets = {}

let APP_PORT = '3000'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.get('/login', require('./web-amqp/middleware/login')())
app.post('/login', require('./web-amqp/middleware/do-login')())
app.use(require('./web-amqp/middleware/auth')())

require('./web-amqp/registra-end-points')(app, sockets)

app.use(express.static('web-app'))

webSocket.use(webSocketCookieParser)

webSocket.on('connection', require('./web-amqp/web-socket-conn')(sockets))

http.listen(APP_PORT, () => LOGGER.log('info', 'Servindo na porta ' + APP_PORT))

require('./web-amqp/on-new-notificacao')(sockets)
