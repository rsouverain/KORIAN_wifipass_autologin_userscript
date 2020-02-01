/**
 * tool.js
 */
const aes256 = require('aes256')
const hashLib = require('js-sha3')

/* eslint-disable no-undef */

let encryptionKeys = []
let jsApi = []
let encStrings = []
let defaultEncryptionKeyIndex = []

try {
  encryptionKeys = require('../../hashes/encryptionKeys')
} catch (err) {
}

try {
  jsApi = require('../../encryptees/jsApi')
} catch (err) {
}

try {
  encStrings = require('../../encryptees/strings')
} catch (err) {
}

try {
  defaultEncryptionKeyIndex = require('../../encryptees/_ek')
} catch (err) {
}

/*
  ---- Console / Devtool ----
 */

// @see https://stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open
exports.isDevtoolOpen = function () {
  let isOpen
  let element = new Audio() // does not shows unless verbose filter selected
  Object.defineProperty(element, 'id', {
    get: function () {
      isOpen = true
      return null
    }
  })
  isOpen = false
  // console.dir(element)
  console.debug(element)
  return isOpen
}

/*
  ---- Javascript Variables ----
 */
exports.getString = (index) => {
  return exports.aes.decrypt(encStrings[index])
}

exports.definePropValueRo = function (obj, propName, propValue) {
  const propGet = function () {
    return propValue
  }
  const propSet = function (v) {}
  exports.definePropGetSet(obj, propName, propGet, propSet)
}

exports.definePropValue = function (obj, propName, propValue) {
  if (typeof obj === 'undefined') {
    console.error('defineProp source object is undefined !')
  }
  delete obj[propName]
  Object.defineProperty(obj, propName, {
    value: propValue,
    writable: false,
    enumerable: true,
    configurable: false
  })
  return obj
}

exports.definePropGetSet = function (obj, propName, propGet, propSet) {
  if (typeof obj === 'undefined') {
    console.error('defineProp source object is undefined !')
  }
  delete obj[propName]
  const options = []
  if (typeof propGet === 'function') {
    options.get = propGet
  }
  if (typeof propSet === 'function') {
    options.set = propSet
  }
  Object.defineProperty(obj, propName, {
    enumerable: true,
    configurable: false,
    ...options
  })
  return obj
}

exports.jsVar = (varPath, scope, existsMode) => {
  if (typeof scope === 'undefined') {
    scope = global
  }
  if (typeof existsMode === 'undefined') {
    existsMode = false
  }
  let splitPath = varPath.split('.')
  if (splitPath.length <= 0) {
    console.error(`jsVar: invalid given varPath ( ${varPath} )  resulting in invalid splitPath:`, splitPath)
    return ((existsMode) ? false : undefined)
  }
  let currentScope = scope
  while (splitPath.length > 0) {
    let varName = splitPath.shift()
    if (typeof currentScope[varName] === 'undefined') {
      return ((existsMode) ? false : undefined)
    } else {
      currentScope = currentScope[varName]
    }
  }
  return ((existsMode) ? true : currentScope)
}

exports.jsVarEnc = (varPathEnc, scope, existsMode, encryptionKeyIndex) => {
  if (typeof scope === 'undefined') {
    scope = global
  }
  if (typeof existsMode === 'undefined') {
    existsMode = false
  }

  let varPath = exports.aes.decrypt(varPathEnc, encryptionKeyIndex)
  return exports.jsVar(varPath, scope, existsMode)
}

exports.jsVarEncByIndex = (jsApiIndex, scope, existsMode) => {
  if (typeof scope === 'undefined') {
    scope = global
  }
  if (typeof existsMode === 'undefined') {
    existsMode = false
  }
  return exports.jsVarEnc(jsApi[jsApiIndex], scope, existsMode)
}

exports.rand = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

/*
  ---- String HTML Manipulation  ----
 */
exports.stringToHtmlCode = function (stringText) {
  // @see https://github.com/noobfromvn/hackbar/blob/5f6ef3bf200c439a4592a9bbe81a18c37bb427df/hackbar/js/XSS.js
  let charStringArray = []
  let decimal
  for (let c = 0; c < stringText.length; c++) {
    decimal = stringText.charCodeAt(c)
    charStringArray.push(decimal)
  }
  return '&#' + charStringArray.join(';&#') + ';'
}

/*
  ---- Encryption & Hashes ----
 */

exports.aes = {
  encrypt: (msg, encryptionKeyIndex) => {
    if (typeof encryptionKeyIndex === 'undefined') {
      encryptionKeyIndex = defaultEncryptionKeyIndex
    }
    return aes256.encrypt(encryptionKeys[encryptionKeyIndex], msg)
  },
  decrypt: (msg, encryptionKeyIndex) => {
    if (typeof encryptionKeyIndex === 'undefined') {
      encryptionKeyIndex = defaultEncryptionKeyIndex
    }
    return aes256.decrypt(encryptionKeys[encryptionKeyIndex], msg)
  }
}

exports.base64Encode = (val) => {
  return btoa(val)
}

exports.base64Decode = (encodedVal) => {
  return atob(encodedVal)
}

exports.hash256 = (msg) => {
  return hashLib.keccak256(msg)
}

if (process.env.CONSOLE_ENABLED) {
  global.userscriptTools = exports
}
