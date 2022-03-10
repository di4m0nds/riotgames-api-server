import express from 'express'
import * as routers from './routes/index.js'
import corsMiddelware from './cors/middleware.js'

const app = express()

// Allow application to parse JSON
app.use(express.json())

// Set cors
app.use(corsMiddelware)

app.use('/', routers.main)
app.use('/summoner', routers.summoner)
app.use('/matches', routers.matches)

export { app }
