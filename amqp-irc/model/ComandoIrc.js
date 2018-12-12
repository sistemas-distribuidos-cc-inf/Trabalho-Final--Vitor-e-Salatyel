/**
 *  Formato comando:
 *    - <ID> <PARAMS>
 *  Onde:
 *    - ID representa o nome do comando.
 *    - PARAMS representa os argumentos do comando.
 */
function ComandoIrc (prop) {
  let message = String(prop.replace('/', '')).trim().split(' ')
  this.id = message[0].toUpperCase()
  this.params = message.slice(1).join(' ')

  return this
}

module.exports = ComandoIrc