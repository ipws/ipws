'use strict'

const info = require('../../package.json')
const Path = require('path')
const FS = require('./util/fs')

module.exports = class IPWS {

  static get version () { return info.version }

  constructor (IPFS) {
    this.ipfs = IPFS('localhost', '5001')
  }

  async init () {
    let initialized = await this._is_initialized()
    if (initialized) {
      let err = new Error('ipws is already initialized!')
      return [err]
    }

    try {
      let path = Path.join(process.cwd(), '.ipws')
      let data = { version: this.constructor.version }
      let text = JSON.stringify(data, null, '  ')
      await FS.write_file(path, text, 'utf-8')
      return [null]
    } catch (err) {
      return [err]
    }
  }

  async publish () {
    let initialized = await this._is_initialized()
    if (!initialized) {
      let err = new Error('please, let\'s init first!')
      return [err]
    }

    try {
      let resources = await this.ipfs.util.addFromFs(process.cwd(), { recursive: true })
      let folder = resources[resources.length - 1]
      let hash = folder.hash
      let path = Path.join(process.cwd(), 'version')
      await FS.write_file(path, hash, 'utf-8')
      return [null, hash]
    } catch (err) {
      return [err]
    }
  }

  async _is_initialized () {
    let path = Path.join(process.cwd(), '.ipws')
    try {
      await FS.stat(path)
      return true
    } catch (err) {
      return false
    }
  }

}
