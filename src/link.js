
export class Link {

  constructor ({ name, hash }) {
    this.name = name
    this.hash = hash
    this._block = null
  }

  clone () {
    let link = new Link()
    link.name = this.name
    link.hash = this.hash
  }

  serialize () {
    let name = this.name
    let hash = this.hash
    let link = { name, hash }
    return link
  }

  deserialize (object) {
    let link = new Link(object)
    return link
  }

}
