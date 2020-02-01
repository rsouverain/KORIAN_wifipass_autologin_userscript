const config = require('../config')

module.exports = {
  name: 'KORIAN Free Wifi Autologin Userscript',
  namespace: config.build.userscriptNamespace,
  author: 'rsouverain',
  description: 'Browser userscript to autologin the free wifi from KORIAN EPHAD',
  // match: [
  //   'https://*/*',
  //   'https://**'
  // ],
  include: [
    'http://passman02.wifipass.org*',
  ],
  homepage: 'https://github.com/rsouverain/KORIAN_wifipass_autologin_userscript',
  downloadURL: 'https://raw.githubusercontent.com/rsouverain/KORIAN_wifipass_autologin_userscript/live/' + config.build.userscriptNamespace + '.user.js',
  updateURL: 'https://raw.githubusercontent.com/rsouverain/KORIAN_wifipass_autologin_userscript/live/' + config.build.userscriptNamespace + '.meta.js',
  icon: 'https://i.imgur.com/v7SKKdU.png',
  grant: 'none',
  'run-at': 'document-start',
  version: '2020.1.0' // This will get overrided at build-time using config/version.js
}
