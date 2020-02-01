
/*
  ---- UID ----
 */

exports.generateUid = function (patern) {
  return ('' + patern).replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// export const longUid = function () {
//   return exports.generateUid('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
// }
//
// export const mediumUid = function () {
//   return exports.generateUid('xxxxyxxxyxxx')
// }

exports.randUid = function () {
  let paterns = [
    'xxxyxx-yxxyx',
    'xxyxyxx-yxxyx',
    'xyxxx-xxyx',
    'xxxyxyx',
    'xxxx-xxxyxyx'
  ]
  let randPatern = paterns[Math.floor(Math.random() * paterns.length)]
  return exports.generateUid(randPatern)
}

// exports.shortUid = function () {
//   return exports.generateUid('xxYxx')
// }

// exports.stringToColor = function (str) {
//   let hash = 0
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash)
//   }
//   // This mutiply the hash by so that "str1" will not have a color too close to "str2"
//   hash = hash * 5100
//   let colour = '#'
//   for (let i = 0; i < 3; i++) {
//     let value = (hash >> (i * 8)) & 0xFF
//     colour += ('00' + value.toString(16)).substr(-2)
//   }
//   return colour
// }
