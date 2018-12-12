/* eslint-disable */

/*
 * Reutilização do script criado no projeto 1 para validação de argumentos
 *
 * Os RegExp utilizados podem foram obtidos da RFC 2812:
 *   * https://tools.ietf.org/html/rfc2812#page-42
 */
//Primeira letra da verificação do user foi modificada para aceitar apenas letras
//Primeira letra da verificação do nickname foi modificada para aceitar apenas letras
const digit         = '[0-9]';
const hexDigit      = '[0-9a-fA-F]';
const letter        = '[a-zA-Z]';
const special       = '[\\u005B-\\u0060\\u007B-\\u007D]';
const key           = '([\\u0001-\\u0005\\u0007-\\u0008\\u000E-\\u001F\\u0021-\\u007F]|\\u000C){1,23}';
const user          = '(' + letter + '([\\u0001-\\u0009\\u000B-\\u000C\\u000E-\\u001F\\u0021-\\u003F\\u0041-\\u00FF])*)';
const channelId     = '([A-Z0-9]){5}';
const chanString    = '[\\u0001-\\u0007\\u0008-\\u0009\\u000B-\\u000C\\u000E-\\u001F\\u0021-\\u002B\\u002D-\\u0039\\u003B-\\u00FF]+';
const nickname      = '(' + letter + '){1}(' + letter + '|' + digit + '|' + special + '|[-]){0,20}';
const ipv4          = '((' + digit + '{1,3}[.]){3}' + digit + '{1,3})';
const ipv6          = '((' + hexDigit + '+' + '([:]' + hexDigit + '+' + '){7})|(([0][:]){5}([0]|[F]{4})[:]' + ipv4 + '))';
const hostAddress   = '(' + ipv4 + '|' + ipv6 + ')';
const letterOrDigit = letter + '|' + digit;
const shortName     = '((' + letterOrDigit + ')(' + letterOrDigit + '|[-]' + ')*(' + letterOrDigit + ')*)';
const hostName      = '(' + shortName + '([.]' + shortName + ')*)';
const host          = '(' + hostName + '|' + hostAddress + ')';
const serverName    = hostName;
const channel       = '(([#])' + chanString + '([:]' + chanString + ')?)';
const userAtServer  = '('+ user + '([%]' + host + ')?[@]' + serverName + ')';
const userAtHost    = '(' + user + '[%]' + host + ')';
const nicknameAtHost = '(' + nickname + '[!]' + user + '[@]' + host + ')';
const msgTo         = '(' + channel + '|' + userAtServer + '|' + userAtHost + '|' + nickname + '|' + nicknameAtHost + ')';
const msgTarget     = '(' + msgTo + '([,]'+ msgTo + ')*)';
const target        = '(' + nickname + '|' + serverName + ')';
const privmsgUser   = '(' + userAtServer + '|' + userAtHost + '|' + nickname + '|' + nicknameAtHost + ')';

function isPrivmsgUser(str) {
  return toMatchExactlyRegExp(privmsgUser).test(str);
}

function isTarget(str) {
  return toMatchExactlyRegExp(target).test(str);
}

function isMsgTarget(str) {
  return toMatchExactlyRegExp(msgTarget).test(str);
}

function isMsgTo(str) {
  return toMatchExactlyRegExp(msgTo).test(str);
}

function isUserAtHost(str){
  return toMatchExactlyRegExp(userAtHost + '+').test(str);
}

function isUserAtServer(str){
  return toMatchExactlyRegExp(userAtServer + '+').test(str);
}

function isNicknameAtHost(str){
  return toMatchExactlyRegExp(nicknameAtHost + '+').test(str);
}

function isChannel(str) {
  return toMatchExactlyRegExp(channel).test(str);
}

function isServerName(str) {
  return toMatchExactlyRegExp(serverName).test(str);
}

function isHost(str) {
  return toMatchExactlyRegExp(host).test(str);
}

function isHostname(str) {
  return toMatchExactlyRegExp(hostName).test(str);
}

function isShortname(str) {
  return toMatchExactlyRegExp(shortName).test(str);
}

function isHostAddr(str) {
  return toMatchExactlyRegExp(hostAddress).test(str);
}

function isIP6addr(str) {
  return toMatchExactlyRegExp(ipv6).test(str);
}

function isIP4addr(str) {
  return toMatchExactlyRegExp(ipv4).test(str);
}

function isNickname(str) {
  return toMatchExactlyRegExp(nickname).test(str);
}

function isChanString(str) {
  return toMatchExactlyRegExp(chanString).test(str);
}

function isChannelId(str) {
  return toMatchExactlyRegExp(channelId).test(str);
}

function isUser(str) {
  return toMatchExactlyRegExp(user).test(str);
}

function isKey(str) {
  return toMatchExactlyRegExp(key).test(str);
}

function isSpecial(str) {
  return toMatchExactlyRegExp(special + '+').test(str);
}

function isLetter(str) {
  return toMatchExactlyRegExp(letter + '+').test(str);
}

function isDigit(str) {
  return toMatchExactlyRegExp(digit + '+').test(str);
}

function isHexDigit(str) {
  return toMatchExactlyRegExp(hexDigit + '+').test(str);
}

function toMatchExactlyRegExp(pattern) {
  return new RegExp('^' + pattern + '$');
}
module.exports = {
  nicknameAtHost: isNicknameAtHost,
  userAtServer: isUserAtServer,
  userAtHost: isUserAtHost,
  privmsgUser:isPrivmsgUser,
  msgTarget: isMsgTarget,
  target: isTarget,
  msgTo: isMsgTo,
  host: isHost,
  serverName: isServerName,
  channel: isChannel,
  channelId: isChannelId,
  channelName: isChanString,
  nickname: isNickname,
  user: isUser,
  key: isKey
};