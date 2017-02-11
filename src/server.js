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

  router.get('/beers', async function(ctx) {
    ctx.body = await BeerModel.list()
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.httpPort, () => {
      console.log(`Some magic is happening on port ${config.httpPort}...`)
    })

})()
