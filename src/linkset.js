import { Link } from './link.js'

export class LinkSet {

  constructor (links) {
    if (links instanceof LinkSet) {
      return new LinkSet(links._links)
    }
    this._links = []

    if (Array.isArray(links)) {
      for (let link of links) {
        if (!(link instanceof Link)) {
          link = new Link(link)
        }
        this._links.push(link)
      }
    }
  }

  serialize () {
    let serialized_links = []

    let links = this._links
    for (let link of links) {
      let serialized_link = link.serialize()
      serialized_links.push(serialized_link)
    }

    return serialized_links
  }

  deserialize (serialized_links) {
    let link_set = new LinkSet()

    let deserialized_links = []
    for (let serialized_link of serialized_links) {
      let deserialized_link = serialized_link.deserialize()
      deserialized_links.push(deserialized_link)
    }

    link_set._links = deserialized_links
    return
  }

  get (name) {
    let link = this._links.find(link => link.name === name)
    return link
  }

  set (link) {
    let link_set = new LinkSet(this._links)

    let link_name = link.name
    let old_link_index = link_set._links.findIndex(link => link.name === link_name)

    if (old_link_index >= 0) {
      link_set._links.splice(old_link_index, 1)
    }

    link_set._links.push(link)

    return link_set
  }

}
