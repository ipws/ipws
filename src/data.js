'use strict'

export default class Data {

  constructor (data) {
    data = data || {}
    this.hash = data.hash || null
    this._value = null
  }

  serialize () {
    let hash = this.hash
    return { hash }
  }

  deserialize (object) {
    let data = new Data(object)
    return data
  }

}
