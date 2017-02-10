const fs = require('fs')
const config = JSON.parse(fs.readFileSync('config.json','utf8'))

const Koa = require('koa');
const app = new Koa();


app.listen(config.httpPort, () => {
    console.log(`Some magic is happening on port ${config.httpPort}...`)
})
