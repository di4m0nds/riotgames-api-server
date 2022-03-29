import axios from 'axios'
import 'dotenv/config'

import { encrypt, decrypt } from '../../crypto/crypto.js'
import regionHelper from '../../helper/region.js'

// REDIS
import { getRedisCacheKey, setRedisCacheKey, deleteRedisKeyCache } from '../../redis/redisHandler.js'

const summonerController = {}

// Get summoner by region and gamename
summonerController.getSummonerShort = async (req, res) => {
  const { region, name } = req.params
  const summonerName = encodeURI(name.replace(' ', '').toLowerCase())
  const summonerRegion = regionHelper.countries[region]
  const keyOfRedis = `SDATA-${summonerRegion}-${summonerName}`
  let version

  // Redis Replay
  const reply = await getRedisCacheKey(keyOfRedis)
  if (reply) return res.json(reply)

  // Response SUMMONER
  const response = await axios.get(`https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_TOKEN}`)
    .catch(err => res.json(err.status))
  if (response.data) {
    // Get last version for profile icon
    await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(response => { version = response.data })
      .catch(e => console.log(e))
    const urlIcon = `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${response.data.profileIconId}.png`
    // ResultData
    const resData = {
      id: encrypt(response.data.id),
      accountId: encrypt(response.data.accountId),
      puuid: encrypt(response.data.puuid),
      name: response.data.name,
      profileIcon: urlIcon,
      revisionDate: response.data.revisionDate,
      summonerLevel: response.data.summonerLevel,
      error: false
    }
    // Redis Save Data
    await setRedisCacheKey(keyOfRedis, resData)

    return res.json(resData)
  }
}

summonerController.getSummonerLong = async (req, res) => {
  const { region, name } = req.params
  const summonerRegion = regionHelper.countries[region]
  const summonerName = encodeURI(name.replace(' ', '').toLowerCase())
  const keyOfRedis = `EXTDATA-${summonerRegion}-${summonerName}`
  const championMastery = []
  const leagueData = []
  let version

  const reply = await getRedisCacheKey(keyOfRedis)
  if (reply) return res.json(reply)

  const response = await axios.get(`https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_TOKEN}`)
    .catch(err => res.json(err.status))

  if (response.data) {
    const championMasteryResponse = await axios.get(`https://${summonerRegion}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${response.data.id}?api_key=${process.env.RIOT_TOKEN}`)
      .catch(err => console.log(err))

    championMasteryResponse?.data.forEach(champ => {
      championMastery.push({
        champId: champ.championId,
        champLevel: champ.championLevel,
        champPoints: champ.championPoints,
        lastPlayTime: champ.lastPlayTime,
        chestGranted: champ.chestGranted
      })
    })
    championMastery.length = 50

    const leagueResponse = await axios.get(`https://${summonerRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${response.data.id}?api_key=${process.env.RIOT_TOKEN}`)
    leagueResponse?.data
      .filter(league => league?.queueType !== 'RANKED_TFT_PAIRS')
      .forEach(league => {
        leagueData.push({
          leagueId: encrypt(league?.leagueId),
          type: league.queueType,
          tier: league.tier,
          rank: league.rank,
          lp: league.leaguePoints,
          wins: league.wins,
          losses: league.losses,
          hotStreak: league.hotStreak
        })
      })

    // Get last version for profile icon
    await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(response => { version = response.data })
      .catch(e => console.log(e))
    const urlIcon = `https://ddragon.leagueoflegends.com/cdn/${version[0]}/img/profileicon/${response.data.profileIconId}.png`

    const resData = {
      id: encrypt(response.data.id),
      accountId: encrypt(response.data.accountId),
      puuid: encrypt(response.data.puuid),
      name: response.data.name,
      profileIcon: urlIcon,
      revisionDate: response.data.revisionDate,
      summonerLevel: response.data.summonerLevel,
      topChampionMastery: championMastery,
      leagueData,
      error: false
    }

    await setRedisCacheKey(keyOfRedis, resData)

    return res.json(resData)
  }
}

// Clear cache data of summoner
summonerController.clearCache = async (req, res) => {
  const { region, name } = req.params
  const sRCountry = regionHelper.countries[region]
  const sRContinent = regionHelper.continents[region]
  const summonerName = name.replace(' ', '').toLowerCase()

  const response = await axios.get(`https://${sRCountry}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_TOKEN}`)
    .catch(err => res.json(err.status))

  if (response.data) {
    const keyEXTDATA = `EXTDATA-${sRCountry}-${summonerName}`
    await deleteRedisKeyCache(keyEXTDATA)
    const keyMATCHES = `MATCHES-${sRContinent}-${response.data.puuid}`
    await deleteRedisKeyCache(keyMATCHES)

    return res.json({ clear: 'ok' })
  }
}

//   Get icon by id
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
summonerController.getChampionMastery = async (req, res) => {
  const { region, id } = req.params
  const idDecrypted = decrypt(id)

  await axios.get(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${idDecrypted}?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json(response.data))
    .catch(err => console.log(err))
}

export default summonerController
