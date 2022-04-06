import express from 'express'

import * as routers from './routes/index.js'
import { deleteRedisCache } from './redis/redisHandler.js'

import corsMiddelware from './cors/middleware.js'
import responseTime from 'response-time'

const app = express()

// Allow application to parse JSON
app.use(express.json())

// Show response time
app.use(responseTime())

// Set cors
app.use(corsMiddelware)

// Services V1
app.use('/api/', routers.main)
app.use('/api/summoner', routers.summoner)
app.use('/api/matches', routers.matches)
app.use('/api/champions', routers.champions)

// Services V2 (Encrypted)
app.use('/srv/lol/api/v2/summoner', routers.summonerV2)
app.use('/srv/lol/api/v2/matches', routers.matchesV2)
app.use('/srv/lol/api/v2/champions', routers.championsV2)
app.use('/srv/lol/api/v2/yt', routers.ytV2)

// Clear Redis Data
app.get('/srv/clear', async (_, res) => {
  await deleteRedisCache()
  res.json({ clear: true })
})

export { app }
