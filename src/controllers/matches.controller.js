import axios from 'axios'
import 'dotenv/config'

const matchesController = {}

matchesController.getMatches = async (req, res) => {
  const { region, puuid, count } = req.params
  let matchesIds = []
  const matchesData = []

  await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${process.env.RIOT_TOKEN}`)
    .then(response => { matchesIds = response.data })
    .catch(e => console.error(e))

  for (const current in matchesIds) {
    await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchesIds[current]}?api_key=${process.env.RIOT_TOKEN}`)
      .then(response => matchesData.push(response.data))
      .catch(e => console.error(e))
  }

  const matchesFiltered = matchesData.filter(game => game.info.gameMode === 'CLASSIC' && game.info.gameType === 'MATCHED_GAME')

  res.json(matchesFiltered)
}

export default matchesController
