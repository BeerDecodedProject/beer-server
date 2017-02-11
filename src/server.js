(async () => {
  const config = require('../config.json')

  const DBManager = require('./db-manager')
  const dbManager = new DBManager(config.database)

  const BreweryModel = require('./models/brewery')
  const SellerModel = require('./models/seller')
  const BeerModel = require('./models/beer')

  await dbManager.init()
  await dbManager.checkStructure()

  const Koa = require('koa')
  const Router = require('koa-router')

  const app = new Koa()
  const router = new Router({
    prefix: '/api'
  })

  router.use(async function (ctx, next) {
    const start = Date.now()
    await next()
    const delta = Math.ceil(Date.now() - start)
    ctx.set('X-Response-Time', `${delta}ms`)
  })

  router.get('/', function (ctx) {
    ctx.body = "Hello, world!"
  })

  router.get('/beers', async function (ctx) {
    ctx.body = await BeerModel.list()
  })

  router.get('/beers/:id', async function (ctx) {
    try {
      const response = await BeerModel.get(ctx.params.id)
      response.prices.forEach((price, i) => {
        response.prices[i].seller = response.pricesSellers.filter(pricesSeller => pricesSeller.id == price.seller)[0].name
      })
      ctx.body = response
    } catch (e) {
      console.error(e)
      ctx.status = 500
    }
  })
  router.get('/beers/search/:str', async function (ctx) {
    ctx.body = await BeerModel.search(ctx.params.str)
    ctx.status = 200
  })

  router.get('/trees/beers', async function(ctx) {
    ctx.body = await BeerModel.tree()
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.httpPort, () => {
      console.log(`Some magic is happening on port ${config.httpPort}...`)
    })

})()
