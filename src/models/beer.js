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

  static async get(id) {
    return (await rethink.table('beer').eqJoin('brewery', rethink.table('brewery')).filter({ left: { id: '0153d3c9-0e28-486b-87b1-bff1c65b7841' } }).map(row => {
      return {
        left: row('left'),
        right: {
          brewery: row('right')
        }
      }
    })
    .zip().run(DBManager.conn)).toArray()
  }
}

module.exports = BeerModel
