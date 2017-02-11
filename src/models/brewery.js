const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

class BreweryModel {
  static create(content) {
    return rethink.table('brewery').insert(content).run(DBManager.conn)
  }

  static getRandom() {
    return rethink.table('brewery').sample(1).run(DBManager.conn)
  }

  static async clear(){
    return (await rethink.table('brewery').run(DBManager.conn)).toArray()
  }
}

module.exports = BreweryModel
