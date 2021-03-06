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
    return (await rethink.table('beer').eqJoin('brewery', rethink.table('brewery')).filter({ left: { id: id } }).map(row => {
      return {
        left: row('left'),
        right: {
          brewery: row('right')
        }
      }
    })
      .zip()
      .merge(function (beer) {
        return {
          pricesSellers: rethink.table('seller').getAll(rethink.args(beer('prices')('seller'))).coerceTo('array'),
          measurements: rethink.table('measurement').getAll(beer('id'), {index:'beer'}).coerceTo('array')
        }
      }).run(DBManager.conn)).next()
  }

  static async search(str) {
    const result = await rethink.table('beer').filter(beer => {
      return beer('name').match('^' + str)
    }).run(DBManager.conn)
    return result.toArray()
  }

  static async tree() {
    return Promise.resolve({ children: await BeerModel.list() });
  }
}

module.exports = BeerModel
