(async () => {
    const fs = require('fs')
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

    const DBManager = require('./db-manager')
    const dbManager = new DBManager(config)

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

    router.get('/', function (ctx, next) {
        ctx.body = "Hello, world!"
    })

    app
        .use(router.routes())
        .use(router.allowedMethods())
        .listen(config.httpPort, () => {
            console.log(`Some magic is happening on port ${config.httpPort}...`)
        })

})()
