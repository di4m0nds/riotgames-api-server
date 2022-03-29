import axios from 'axios'
import 'dotenv/config'

import { decrypt } from '../../crypto/crypto.js'
import { getRedisCacheKey, setRedisCacheKey } from '../../redis/redisHandler.js'

import regionHelper from '../../helper/region.js'
import matchHelper from '../../helper/match.js'

const matchesController = {}

matchesController.getMatches = async (req, res) => {
  const { region, puuid, count } = req.params
  const puuidDecrypted = decrypt(puuid)
  const regionApi = regionHelper.continents[region]
  const keyOfRedis = `MATCHES-${regionApi}-${puuidDecrypted}`
  let matchesIds = []
  const matchesData = []

  const reply = await getRedisCacheKey(keyOfRedis)
  if (reply) return res.json(reply)

  // Get Matches
  await axios.get(`https://${regionApi}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuidDecrypted}/ids?start=0&count=${count}&api_key=${process.env.RIOT_TOKEN}`)
    .then(response => { matchesIds = response.data })
    .catch(e => console.error(e))
  for (const current in matchesIds) {
    await axios.get(`https://${regionApi}.api.riotgames.com/lol/match/v5/matches/${matchesIds[current]}?api_key=${process.env.RIOT_TOKEN}`)
      .then(response => matchesData.push(response.data))
      .catch(e => console.error(e))
  }
  // Filter matches by gameType
  const matchesFiltered = matchesData.filter(game => game.info.gameType === 'MATCHED_GAME' && (game.info.gameMode === 'CLASSIC' || game.info.gameMode === 'ARAM'))
  // Get Queue
  const { data: queueIds } = await axios.get('https://static.developer.riotgames.com/docs/lol/queues.json')

  // Encrypt Data
  const matches = matchHelper.matchesModel(matchesFiltered, queueIds)

  await setRedisCacheKey(keyOfRedis, matches)

  res.json(matches)
}

export default matchesController
