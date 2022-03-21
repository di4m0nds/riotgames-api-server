import { Router } from 'express'
import summonerController from '../../controllers/summoner/summoners.controller.js'

const { getSummoner, getSummonerIcon, getSummonerPuuid, getChampionMastery } = summonerController

const router = Router()
router.get('/', (_, res) => res.json({ 'summoners-api': 'ok' }))

router.route('/:region&:name')
  .get(getSummoner)

router.route('/puuid/:region&:puuid')
  .get(getSummonerPuuid)

router.route('/icon/:id')
  .get(getSummonerIcon)

// Champion Mastery
router.route('/CM/:region&:id')
  .get(getChampionMastery)

export { router as summoner }
