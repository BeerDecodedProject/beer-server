(async () => {
  const fs = require('fs')
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

  const DBManager = require('./../db-manager')
  const dbManager = new DBManager(config)

  await dbManager.init()
  await dbManager.checkStructure()

  const faker = require('faker')
  const SellerModel = require('./../models/seller')
  const BreweryModel = require('./../models/brewery')


  let done = 0
  for (let i = 0; i < 50; i++) {
    BreweryModel.create({
      name: faker.company.companyName(),
      country: faker.address.country(),
      region: faker.address.county(),
      city: faker.address.city(),
      address: faker.address.streetAddress(),
      website: faker.internet.url(),
      phone: faker.phone.phoneNumber()
    }).then(() => {
      if (++done < 50) return
      console.log('Breweries generated')
      process.exit(0)
    })
  }

})()
