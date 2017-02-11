const rethink = require('rethinkdb')

class DBManager {

  static get conn() {
    return this._conn
  }
  static set conn(conn) {
    DBManager._conn = conn
  }

  constructor(config) {
    this.config = config
  }

  init() {
    return new Promise(async (resolve, reject) => {
      try {
        DBManager.conn = await rethink.connect(this.config)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  checkStructure() {
    return new Promise(async (resolve, reject) => {
      const dbExists = await rethink.dbList().contains(this.config.db)
        .do(databaseExists => databaseExists).run(DBManager.conn)

      if (!dbExists) {
        console.log(`Please ensure that you have a database called : ${this.config.db}`)
        process.exit(1)
      }

      const tableChecks = []
      const tableNames = ['beer', 'brewery', 'measurement', 'seller']
      tableNames.forEach(async (tbName) => {
        tableChecks[tableChecks.length] = rethink.tableList().contains(tbName)
          .do(tbExists => tbExists).run(DBManager.conn)
      });
      (await Promise.all(tableChecks)).forEach(exists => {
        if (!exists) {
          console.log(`Please ensure that you have all the following tables : ${tableNames.join(', ')}`)
          process.exit(1)
        }
      })
      resolve()
    })
  }
}

module.exports = DBManager
