const rethink = require('rethinkdb')
const DBManager = require('./../db-manager')

class SellerModel {
    static create(content) {
        return rethink.table('seller').insert(content).run(DBManager.conn)
    }
}

module.exports = SellerModel