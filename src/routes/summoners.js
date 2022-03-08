import { Router } from 'express'
import summonerController from '../controllers/summoners.controller.js'

const { getSummoner, getSummonerIcon, getSummonerPuuid } = summonerController

const router = Router()
router.get('/', (_, res) => res.json({ 'summoners-api': 'ok' }))

router.route('/:region&:name')
  .get(getSummoner)

router.route('/icon/:id')
  .get(getSummonerIcon)

router.route('/puuid/:region&:puuid')
  .get(getSummonerPuuid)

export { router as summoner }
