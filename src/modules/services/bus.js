let Vue = require('vue').default

const bus = {
  event: new Vue()
}

if (process.env.CONSOLE_ENABLED) {
  global.userscriptBus = bus // <--- DEBUG ONLY
}
module.exports = bus
