import axios from 'axios'
import 'dotenv/config'

import { getRedisCacheKey, setRedisCacheKey } from '../../redis/redisHandler.js'

const matchesController = {}

const getRegion = {
  la2: 'americas',
  la1: 'americas',
  br1: 'americas',
  na1: 'americas',
  euw1: 'europe',
  eun1: 'europe',
  jp1: 'asia',
  ru: 'asia',
  tr1: 'asia'
}

matchesController.getMatches = async (req, res) => {
  const { region, puuid, count } = req.params
  const regionApi = getRegion[region]
  const cacheKey = `matches-${puuid}`
  let matchesIds = []
  const matchesData = []

  const reply = await getRedisCacheKey(cacheKey)
  if (reply) return res.json(reply)

  await axios.get(`https://${regionApi}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${process.env.RIOT_TOKEN}`)
    .then(response => { matchesIds = response.data })
    .catch(e => console.error(e))

  for (const current in matchesIds) {
    await axios.get(`https://${regionApi}.api.riotgames.com/lol/match/v5/matches/${matchesIds[current]}?api_key=${process.env.RIOT_TOKEN}`)
      .then(response => matchesData.push(response.data))
      .catch(e => console.error(e))
  }

  const matchesFiltered = matchesData.filter(game => game.info.gameType === 'MATCHED_GAME' && (game.info.gameMode === 'CLASSIC' || game.info.gameMode === 'ARAM'))
  await setRedisCacheKey(cacheKey, matchesFiltered)

  res.json(matchesFiltered)
}

export default matchesController
