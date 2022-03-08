import { Router } from 'express'
import axios from 'axios'
import 'dotenv/config'

const route = Router()

route.get('/', (_, res) => res.json({ 'summoner-api': 'ok' }))

route.get('/:region&:name', async (req, res) => {
  const { region, name } = req.params

  await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json(response.data))
    .catch(err => console.log(err))
})

export { route as summoner }
