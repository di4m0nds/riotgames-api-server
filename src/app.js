import express from 'express'
import * as routers from './routes/index.js'

const app = express()
app.use(express.json())

app.use('/', routers.main)
app.use('/summoner', routers.summoner)

export { app }
