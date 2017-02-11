const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

const config = require('../../config.json')

class BeerModel {
  static create(content) {
    return rethink.table('beer').insert(content).run(DBManager.conn)
  }

  static clear() {
    return rethink.table('beer').delete().run(DBManager.conn)
  }

  static async list() {
    return (await rethink.table('beer').withFields('id', 'name').map(row => {
      return {
        id: row('id'),
        name: row('name'),
        url: rethink.expr(config.url).add('/api/beers/').add(row('id'))
      }
    }).run(DBManager.conn)).toArray()
  }
}

module.exports = BeerModel