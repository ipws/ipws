'use strict'

export default class Store {

  constructor (ipfs) {
    this.ipfs = ipfs
  }

  async get (hash) {
    let res = await this.ipfs.dag.get(hash)
    let data = res.value
    return data
  }

  async put (data) {
    let cid = await this.ipfs.dag.put(data)
    let hash = cid.toBaseEncodedString()
    return hash
  }

}