const fs = require('fs')

const config = JSON.parse(fs.readFileSync('config.json','utf8'))

const express = require('express')
const app = express()

let router = express.Router()


app.listen(config.httpPort, () => {
    console.log(`Some magic is happening on port ${config.httpPort}...`)
})
