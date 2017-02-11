(async () => {
  const fs = require('fs')
  const config = require('../../config.json')

  const DBManager = require('../db-manager')
  const dbManager = new DBManager(config.database)

  await dbManager.init()
  await dbManager.checkStructure()

  const faker = require('faker')
  const BeerModel = require('../models/beer')
  const BreweryModel = require('../models/brewery')
  const SellerModel = require('../models/seller')

  let done = 0
  for(let i = 0; i < 2000; i++){
    const beerData = {
      name: faker.commerce.productName(),
      density: Math.random() * (80) + 1,
      fermenting: Math.floor(Math.random() * 2),
      image: faker.image.imageUrl(),
      recipies: [
        "ONE",
        "TWO",
        "THREE"
      ],
      process: "YOLO",
      brewery: (await BreweryModel.getRandom())[0].id,
      prices: [
        {
          seller: (await SellerModel.getRandom())[0].id,
          price: Math.random() * (80) + 1,
          currency: "CHF"
        },
        {
          seller: (await SellerModel.getRandom())[0].id,
          price: Math.random() * (80) + 1,
          currency: "CHF"
        },
        {
          seller: (await SellerModel.getRandom())[0].id,
          price: Math.random() * (80) + 1,
          currency: "CHF"
        }
      ]
    }
    BeerModel.create(beerData).then(() => {
      if(++done < 2000) return
      console.log('Beers generated')
      process.exit(0)
    })
  }
})()
