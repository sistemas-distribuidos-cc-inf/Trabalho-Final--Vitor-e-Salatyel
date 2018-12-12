var event = {
  error: 'ircError',
  warn: 'ircWarn',
  info: 'ircInfo',
  message: 'ircMessage',
  connected: 'ircServerConnected',
  joinChannel: 'joinedSuccessful',
  quit: 'quit',
  conversationClose: 'conversationClose',
  part: 'part',
  partall: 'partall',
  nick: 'nick'
}

var TipoTab = {
  CHANNEL: 'CHANNEL',
  USER: 'USER',
  HOME: 'HOME'
}

function TabModel(id, nome, tipo) {
  this.id = id
  this.nome = nome
  this.tipo = tipo
}

var homeTab = new TabModel('item_Home', 'Home', TipoTab.HOME)
var currentTab = null

var tabs = {}

var webSocket = io()

setTimeout(initApp, 100)

function initApp() {
  setSendMessageOnEnter()
  addNewTab(homeTab)
}

function setSendMessageOnEnter() {
  $('#mensagem').keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault()
      $('#sendbutton').click()
    }
  })
}

webSocket.on('connect', function () {
  statusConectando()
})

webSocket.on('disconnect', function () {
  statusDesconectado()
  for (pos in tabs) {
    removeTab(tabs[pos])
  }
})

webSocket.on(event.connected, function (message) {
  console.log('CONNECTADO')
  statusConectado()
  addNewMessage(getInfo(message), message.message, homeTab.id)
})

webSocket.on(event.quit, function (message) {
  addNewMessage(getInfo(message), message.message, homeTab.id)
  quit()
})

webSocket.on(event.part, function (message) {
  part(message.message)
})

webSocket.on(event.partall, function () {
  partall()
})

webSocket.on(event.nick, function (message) {
  createWarn(message)
  Cookies.set('nickname', message.nickname)
})

webSocket.on(event.warn, function (warn) {
  createWarn(warn)
})

function createWarn(warn) {
  $('#status')
    .removeClass('alert alert-danger alert-success')
    .addClass('alert alert-warning')
    .text(warn.message)
  clearAlert()
}

function statusConectando() {
  $('#status')
    .removeClass('alert alert-success alert-danger')
    .addClass('alert alert-warning')
    .text("Conectando - irc://" + Cookies.get("nickname") + "@" + Cookies.get("server"))
}

function statusDesconectado() {
  $('#status')
    .removeClass('alert alert-warning alert-success')
    .addClass('alert alert-danger')
    .text("Desconectado - irc://" + Cookies.get("nickname") + "@" + Cookies.get("server"))
}

function statusConectado() {
  $('#status')
    .removeClass('alert alert-warning alert-danger')
    .addClass('alert alert-success')
    .text("Conectado - irc://" + Cookies.get("nickname") + "@" + Cookies.get('server'))
}

function quit() {
  Cookies.remove("nickname")
  Cookies.remove('server')
  Cookies.remove('channel')
  Cookies.remove('username')
  Cookies.remove('token')
  Cookies.remove('io')
  window.location.reload()
}

function part(message) {
  onFecharTab(message)
}

function partall() {
  var ul = document.getElementById("chat-tabs")
  var items = ul.getElementsByTagName("li")
  for (var i = 2; i < items.length; i++) {
    if (items[i].id.substring(5, 6) === 'C')
      part('#' + items[i].id.substring(13).trim())
  }
}


webSocket.on(event.message, function (message) {
  if (isNewUserMsg(message)) {
    addNewTab(new TabModel('item_USER_' + message.nickname, message.nickname, TipoTab.USER))
  }
  addNewMessage(getInfo(message), message.message, getTabId(message))
})

function isNewUserMsg(message) {
  return !message.channel && !!message.nickname && !tabs['item_USER_' + message.nickname]
}

webSocket.on(event.joinChannel, function (message) {
  console.log('CONNECTADO EM CANAL')
  if (tabs['item_CHANNEL_' + message.channel.slice(1)])
    return;
  addNewTab(new TabModel('item_CHANNEL_' + message.channel.slice(1), message.channel, TipoTab.CHANNEL))
  addNewMessage(getInfo(message), message.message, currentTab.id)
})

webSocket.on(event.conversationClose, function (message) {
  if (!!message.nickname && !!tabs['item_USER_' + message.nickname]) {
    removeTab(tabs['item_USER_' + message.nickname])
  } else if (!!message.channel && !!tabs['item_CHANNEL_' + message.channel.slice(1)]) {
    removeTab(tabs['item_CHANNEL_' + message.channel.slice(1)])
  }
})

webSocket.on(event.error, function (error) {
  $('#status')
    .removeClass('alert alert-warning alert-success')
    .addClass('alert alert-danger')
    .text(error.message)
  clearAlert()
})

function clearAlert() {
  setTimeout(function () {
    statusConectado()
  }, 7000)
}

function getInfo(message) {
  return toDateString(message.timestamp) + ' - ' + (message.nickname ? message.nickname : Cookies.get('nickname'))
}

function getTabId(message) {
  if (!message.channel && !message.nickname && !!message.server) {
    return homeTab.id
  }
  if (!!message.channel && !!tabs['item_CHANNEL_' + message.channel.slice(1)]) {
    return 'item_CHANNEL_' + message.channel.slice(1)
  }
  if (!!message.nickname) {
    return 'item_USER_' + message.nickname
  }
}

function addNewMessage(info, dado, tabId) {
  $('#mural-' + tabId).append(
    '<div class=\"col-sm-3\">' + info + '</div>' +
    '<pre class="col-sm-9">' + dado + '</pre>'
  )

  updateMuralScroll(tabId)
}

function updateMuralScroll(tabId) {
  var muralContainer = document.getElementById('mural-container-' + tabId)
  muralContainer.scrollTop = muralContainer.scrollHeight
}

function toDateString(timestamp) {
  var date = new Date(timestamp)
  var hours = date.getHours()
  var s_hours = hours < 10 ? "0" + hours : "" + hours
  var minutes = date.getMinutes()
  var s_minutes = minutes < 10 ? "0" + minutes : "" + minutes
  var seconds = date.getSeconds()
  var s_seconds = seconds < 10 ? "0" + seconds : "" + seconds
  return s_hours + ":" + s_minutes + ":" + s_seconds
}

function sendMessage(idValue) {
  var mensagem = document.getElementById(idValue).value
  document.getElementById(idValue).value = ''

  var data = JSON.stringify({
    destination: {
      name: currentTab.nome,
      type: currentTab.tipo
    },
    timestamp: Date.now(),
    message: mensagem
  })

  sendRequest({
    type: 'post',
    url: '/processar',
    data: data
  })
}

window.onclick = function (event) {
  if (!event.target.matches('.optionsbtn')) {

    var dropdowns = document.getElementsByClassName("optionsdrop-content")
    var i
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show')
      }
    }
  }
}

function mudaserver() {
  window.open("/server-change", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=500,width=800,height=400")

}

function addNewTab(tabObj) {
  $('#chat-tabs').append(
    '<li id=\"' + tabObj.id + '\" class=\"nav-item\" onclick=\"selectTab(\'' + tabObj.id + '\')\">' +
    '   <a class=\"nav-link active\">' + tabObj.nome + '</a>' +
    '</li>')

  tabs[tabObj.id] = tabObj
  selectTab(tabObj.id)
}

function selectPainelMensagem(tabId) {
  criaPainelDeMensagens(tabId)
  showTabContent(tabId)
}

function criaPainelDeMensagens(tabId) {
  var existsPainel = $('#painel-mensagens #painel-mensagens-' + tabId).length
  if (!existsPainel || existsPainel === 0) {
    $('#painel-mensagens').append(
      '<div id=\"painel-mensagens-' + tabId + '\" class="row col-sm-12">' +
      '   <div class=\"col-sm-2\">' +
      '      <div class=\"row\" style=\"padding: 5px;\">' +
      '      </div>' +
      '   </div>' +
      '   <div class=\"col-sm-10\">' +
      '      <div class=\"row\" style=\"padding: 15px\">' +
      '         <div id=\"mural-container-' + tabId + '\"' +
      '              class=\"col-sm-12 mural-container\">' +
      '             <div class=\"row\" id=\"mural-' + tabId + '\">' +
      '                 <div class=\"col-sm-2\" id=\"info-mural-' + tabId + '\"></div>' +
      '                 <div class=\"col-sm-10\" id=\"dados-mural-' + tabId + '\"></div>' +
      '             </div>' +
      '         </div>' +
      '      </div>' +
      '    </div>' +
      ' </div>'
    )
  }
}

function showTabContent(tabId) {
  $('#painel-mensagens-' + tabId).show()
  if (!!currentTab && tabId !== currentTab.id) {
    $('#painel-mensagens-' + currentTab.id).hide()
  }
}

function removeTab(tabObj) {
  if (tabObj.id === homeTab.id)
    return

  selectTab(homeTab.id)
  $('#' + tabObj.id).remove()
  delete tabs[tabObj.id]
}

function selectTab(itemId) {
  $('#' + itemId).children('a').addClass('active')
  if (!!currentTab && currentTab.id !== itemId) {
    $('#' + currentTab.id).children('a').removeClass('active')
  }

  selectPainelMensagem(itemId)
  currentTab = tabs[itemId]
}

function onFecharTab(message) {
  var nome
  var tipo
  if (message === '') {
    nome = currentTab.nome
    tipo = currentTab.tipo
  }
  else {
    nome = message
    if (message.substring(0, 1) === '#')
      tipo = 'CHANNEL'
    else
      tipo = 'USER'
  }
  var data = JSON.stringify({
    type: tipo,
    name: nome
  })

  sendRequest({
    type: 'post',
    url: '/close-conversation',
    data: data
  })
}

function sendRequest(opts, callback) {
  var ajaxOptions = {
    type: opts.type,
    url: opts.url,
    data: opts.data,
    success: function (data, status) {
      if (status !== 'success')
        alert('erro:' + status)
      else if (callback)
        callback(data)
    }
  }

  if (opts.type === 'post') {
    ajaxOptions['contentType'] = 'application/json'
    ajaxOptions['dataType'] = 'json'
  }

  $.ajax(ajaxOptions)
}