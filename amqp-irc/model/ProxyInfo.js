
function ProxyInfo(props) {
  this.id = props.token;
  this.servidor = props.server;
  this.nickname = props.nickname;
  this.username = props.username;
  this.canais = [];

  return this;
}

module.exports = ProxyInfo;