import axios from 'axios'
import 'dotenv/config'

import { getRedisCacheKey, setRedisCacheKey } from '../../redis/redisHandler.js'

const summonerController = {}

// Get summoner by region and gamename
summonerController.getSummoner = async (req, res) => {
  const { region, name } = req.params
  const cacheKey = `${region}-${name.replace(' ', '').toLowerCase()}`

  const reply = await getRedisCacheKey(cacheKey)
  if (reply) return res.json(reply)

  await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_TOKEN}`)
    .then(async response => {
      await setRedisCacheKey(cacheKey, response.data)
      return res.json(response.data)
    })
    .catch(err => res.json(err.status))
}

// Get icon by id
summonerController.getSummonerIcon = async (req, res) => {
  const { id } = req.params
  let version

  // Get last version
  await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(response => { version = response.data })
    .catch(e => console.log(e))

  res.json({ iconUrl: `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${id}.png` })
}

// Get summoner by puuid (region: Americas, Europe, Asia, Esports)
summonerController.getSummonerPuuid = async (req, res) => {
  const { region, puuid } = req.params

  await axios.get(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json(response.data))
    .catch(err => console.log(err))
}

// Get summoner by puuid (region: Americas, Europe, Asia, Esports)
summonerController.getChampionMastery = async (req, res) => {
  const { region, id } = req.params

  await axios.get(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json(response.data))
    .catch(err => console.log(err))
}

export default summonerController
