const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

class BeerModel {
  static create(content) {
    return rethink.table('beer').insert(content).run(DBManager.conn)
  }

  static clear(){
    return rethink.table('beer').delete().run(DBManager.conn)
  }
}

module.exports = BeerModel