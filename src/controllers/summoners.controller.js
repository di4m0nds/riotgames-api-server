import axios from 'axios'
import 'dotenv/config'

const summonerController = {}

// Get summoner by region and gamename
summonerController.getSummoner = async (req, res) => {
  const { region, name } = req.params

  await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json(response.data))
    .catch(err => console.log(err))
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

export default summonerController
