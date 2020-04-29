'use strict'

import Meta from './meta.js'
import Data from './data.js'
import Link from './link.js'
import LinkSet from './linkset.js'

export default class Block {

  constructor (store, block) {
    block = block || {}
    this.meta = new Meta(block.meta)
    this.data = new Data(block.data)
    this.links = new LinkSet(block.links)
    this._hash = null
    this._published = false

    this.store = store
  }

  async get value () {
    let value = await this._value()

    this.data._value = value
  }

  async _value () {
    let data
    try {
      data = await this.store.get(this.data.hash)
    } catch (err) {
      console.warn(err)
    }
    return data
  }


  serialize () {
    let meta = this.meta.serialize()
    let data = this.data.serialize()
    let links = this.links.serialize()

    return {
      meta,
      data,
      links
    }
  }

  async get_prev () {
    let prev = this.meta.prev
    if (!prev) {
      return
    }
    if (prev instanceof Block) {
      return prev
    }
    if (typeof prev == 'string') {
      let block = await this.store.get(prev)
      block = new Block(block)
      block._hash = prev
      this.meta.prev = block
      return block
    }
  }

  async get (path, instant) {
    let link_name = path.shift()

    let link = this.links.get(link_name)
    if (!link) {
      return null
    }
    if (link._block) {
      return link._block
    }

    let hash = link.hash
    let block = await this.store.get(hash)
    block = new Block(block)
    block._hash = hash

    if (path.length) {
      block = await block.get(path, instant)
    }

    return block
  }

  async commit () {
    let serialized = this.serialize()
    let hash = await this.store.put(serialized)
    this._hash = hash
    return this
  }

  async get_child (name) {
    let link = this.links.get(name)
    if (!link) {
      return
    }
    let block = link._block
    if (block) {
      return block
    }
    let hash = link.hash
    block = await this.store.get(hash)
    if (!block) {
      return
    }
    block = new Block(block)
    block._hash = hash
    link._block = block
    return block
  }

  async set_data (data) {
    let new_block = new Block(this)
    let data_hash = await this.store.put(data)
    let new_data = new Data({ hash: data_hash })
    new_block.data = new_data
    new_block.meta.prev = this
    await new_block.commit()
    return new_block
  }

  async set_child (name, data) {
    let old_child = await this.get_child(name)
    if (!old_child) {
      old_child = new Block()
    }

    let new_child = await old_child.set_data(data)
    let new_child_hash = new_child._hash

    let new_link = new Link({ name, hash: new_child_hash })
    new_link._block = new_child
    let new_links = this.links.set(new_link)

    let new_block = new Block(this)
    new_block.links = new_links
    new_block.meta.prev = this

    await new_block.commit()

    return new_block
  }

  async set (path, data) {
    let hash = await this.store.put(data)

    if (path.length === 1) {
      let child_name = path[0]
      let new_block = await this.set_child(child_name, data)
      return new_block
    }

    let name = path.shift()
    let old_child = await this.get_child(name)
    if (!old_child) {
      return
    }

    let new_child = await old_child.set(path, data)
    let new_child_hash = new_child._hash

    let new_link = new Link({ name, hash: new_child_hash })
    new_link._block = new_child
    let new_links = this.links.set(new_link)

    let new_block = new Block(this.store, this)
    new_block.links = new_links
    new_block.meta.prev = this

    await new_block.commit()

    return new_block
  }

}
