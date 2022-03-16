import express from 'express'
import * as routers from './routes/index.js'
import corsMiddelware from './cors/middleware.js'
import responseTime from 'response-time'

const app = express()

// Allow application to parse JSON
app.use(express.json())

// Show response time
app.use(responseTime())

// Set cors
app.use(corsMiddelware)

app.use('/api/', routers.main)
app.use('/api/summoner', routers.summoner)
app.use('/api/matches', routers.matches)
app.use('/api/champions', routers.champions)

export { app }
