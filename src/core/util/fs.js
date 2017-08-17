'use strict'

const fs = require('fs')

module.exports = {}

function promisify (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...res) => {
        if (err) {
          reject(err)
          return
        }
        resolve(...res)
      })
    })
  }
}

module.exports.stat = promisify(fs.stat)
module.exports.read_file = promisify(fs.readFile)
module.exports.write_file = promisify(fs.writeFile)