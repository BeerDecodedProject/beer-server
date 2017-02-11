(async () => {
  const fs = require('fs')
  const config = require('../../config.json')

  const DBManager = require('../db-manager')
  const dbManager = new DBManager(config.database)

  await dbManager.init()
  await dbManager.checkStructure()

  const faker = require('faker')
  const SellerModel = require('../models/seller')

  let done = 0
  for(let i = 0; i < 20; ++i){
    SellerModel.create({name: faker.company.companyName()}).then(() => {
      if(++done < 20) return
      console.log('Sellers generated')
      process.exit(0)
    })
  }
})()
