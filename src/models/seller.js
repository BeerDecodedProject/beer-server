const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

class SellerModel {
  static create(content) {
    return rethink.table('seller').insert(content).run(DBManager.conn)
  }
  
  static getRandom() {
    return rethink.table('seller').sample(1).run(DBManager.conn)
  }

  static async clear(){
    return (await rethink.table('seller').run(DBManager.conn)).toArray()
  }
}

module.exports = SellerModel