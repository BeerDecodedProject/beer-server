const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

class SellerModel {
  static create(content) {
    return rethink.table('seller').insert(content).run(DBManager.conn)
  }
  
  static getRandom() {
    return rethink.table('seller').sample(1).run(DBManager.conn)
  }

  static clear(){
    return rethink.table('seller').delete().run(DBManager.conn)
  }
}

module.exports = SellerModel