(async () => {
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

const DBManager = require('./../db-manager')
const dbManager = new DBManager(config)

await dbManager.init()
await dbManager.checkStructure()

const SellerModel = require('./../models/seller')
const faker = require('faker')

for(let i = 0; i < 100000; i++)
    SellerModel.create({name:faker.company.companyName()})

})()