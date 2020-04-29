
export class Meta {

  constructor (meta) {
    meta = meta || {}
    this.instant = meta.instant || Date.now()
    this.version = meta.version || 0
  }

  clone () {
    let meta = new Meta()
    meta.instant = this.instant
    meta.version = this.version
  }

  serialize () {
    let instant = this.instant
    let version = this.version

    let prev = this.prev
    if (prev._hash) {
      prev = prev._hash
    }

    let serialized = {
      instant,
      version,
      prev
    }

    return serialized
  }

  deserialize (object) {
    let meta = new Meta(object)
    return meta
  }

}
