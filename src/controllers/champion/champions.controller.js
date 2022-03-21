import axios from 'axios'
import 'dotenv/config'

const championsController = {}

championsController.getChamps = async (req, res) => {
  const result = await axios.get('http://ddragon.leagueoflegends.com/cdn/12.5.1/data/en_US/champion.json')
    .catch(e => console.error(e))

  res.json(result.data)
}

championsController.getChamp = async (req, res) => {
  const { name } = req.params
  const result = await axios.get(`http://ddragon.leagueoflegends.com/cdn/12.5.1/data/en_US/champion/${name}.json`)
    .catch(e => console.error(e))

  res.json(result?.data)
}

championsController.getFreeRotation = async (req, res) => {
  const { region } = req.params

  await axios.get(`https://${region}.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${process.env.RIOT_TOKEN}`)
    .then(response => res.json(response.data))
    .catch(e => res.json(e.status))
}

export default championsController
