const rethink = require('rethinkdb')

class DBManager {
    constructor(config) {
        this.config = config
    }

    init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.connection = await rethink.connect(this.config.database)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    }

    checkStructure() {
        return new Promise(async (resolve, reject) => {
            const dbExists = await rethink.dbList().contains(this.config.database.db)
                .do(databaseExists => databaseExists).run(this.connection)

            if (!dbExists) {
                console.log(`Please ensure that you have a database called : ${this.config.database.db}`)
                process.exit(1)
            }

            const tableChecks = []
            const tableNames = ['beer', 'brewery', 'measurement', 'seller']
            tableNames.forEach(async (tbName) => {
                tableChecks[tableChecks.length] = rethink.tableList().contains(tbName)
                    .do(tbExists => tbExists).run(this.connection)
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
