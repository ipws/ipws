import { Store } from './store.js'
import { Block } from './block.js'

export class Ipws {

  constructor (ipfs) {
    this.ipfs = ipfs
    this.store = new Store(ipfs)
  }

  static async create (ipfs) {
    let ipws = new Ipws(ipfs)
    await ipws._init()
    return ipws
  }

  async get (path, instant) {
    let segments = path.split('/')
    let block = await this.root.get(segments, instant)
    return block
  }

  async set (path, data) {
    let segments = path.split('/')
    let new_root = await this.root.set(segments, data)
    this.root = new_root
    let new_hash = new_root._hash
    await this._set_root_hash(new_hash)
    return this
  }

  async _init () {
    let root = this.root

    if (root) {
      return root
    }

    let root_hash = await this._get_root_hash()
    if (root_hash) {
      let block = await this.store.get(root_hash)
      root = new Block(this.store, block)
      root._hash = root_hash
      this.root = root
      return root
    }

    root = new Block(this.store)
    await root.commit()
    root_hash = root._hash
    await this._set_root_hash(root_hash)
    this.root = root

    return root
  }

  async _get_root_hash () {
    try {
      let root = await this.ipfs.config.get('root')
      return root
    } catch (err) {
      return undefined
    }
  }

  async _set_root_hash (root_hash) {
    await this.ipfs.config.set('root', root_hash)
  }

}
