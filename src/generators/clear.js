(async () => {
  const fs = require('fs')
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

  const DBManager = require('./../db-manager')
  const dbManager = new DBManager(config)

  await dbManager.init()
  await dbManager.checkStructure()

  const SellerModel = require('./../models/seller')
  const BreweryModel = require('./../models/brewery')
  const BeerModel = require('./../models/beer')

  await BeerModel.clear()
  await BreweryModel.clear()
  await SellerModel.clear()

  console.log('Database cleared')

  process.exit(0)
})()
