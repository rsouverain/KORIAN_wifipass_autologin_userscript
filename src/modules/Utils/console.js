/*

Usage:

this.console = require('../console').factory(() => {
  return 'My Prefix '
})
this.console.log('Foobar', [1,2,3]) // output: '[My Prefix] Foobar' >(3) [1, 2, 3]
*/

const enabled = (typeof process.env.CONSOLE_ENABLED === 'undefined') ? false : process.env.CONSOLE_ENABLED
const functionList = Object.keys(global.console)

export const factory = (prefix, consoleObject) => {
  if (typeof prefix === 'undefined') {
    prefix = null
  }
  if (typeof consoleObject === 'undefined') {
    consoleObject = global.console
  }

  if (enabled && prefix === null) {
    return consoleObject
  }

  const consoleObj = {
    prefix,
    ...consoleObject
  }

  if (typeof consoleObj.prefix !== 'undefined') {
    functionList.forEach((fName, i) => {
      let origFunction = consoleObj[fName]
      consoleObj[fName] = function () {
        let finalPrefix = consoleObj.prefix
        if (typeof consoleObj.prefix === 'function') {
          finalPrefix = consoleObj.prefix()
        }
        if (finalPrefix !== '' && finalPrefix !== null) {
          arguments[0] = `[${finalPrefix}] ${arguments[0]}`
        }
        if (enabled || fName === 'error') {
          return origFunction.apply(null, arguments)
        }
      }
    })
  }
  return consoleObj
}
