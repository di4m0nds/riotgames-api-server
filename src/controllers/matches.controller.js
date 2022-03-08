import axios from 'axios'
import 'dotenv/config'

const matchesController = {}

matchesController.getMatches = async (req, res) => {
  const { region, puuid, count } = req.params

  await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json({ matches: response.data }))
    .catch(e => console.error(e))
}

export default matchesController
