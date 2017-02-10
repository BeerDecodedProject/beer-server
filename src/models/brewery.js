const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

class BreweryModel {
  static create(content) {
    return rethink.table('brewery').insert(content).run(DBManager.conn)
  }

  static getRandom() {
    return rethink.table('brewery').sample(1).run(DBManager.conn)
  }

  static clear(){
    return rethink.table('brewery').delete().run(DBManager.conn)
  }
}

module.exports = BreweryModel