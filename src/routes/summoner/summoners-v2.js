import { Router } from 'express'
import summonerController from '../../controllers/summoner/summoners-v2.controller.js'

const {
  getSummonerShort,
  getSummonerLong,
  getSummonerIcon,
  getChampionMastery,
  clearCache
} = summonerController

const router = Router()
// Active Route
router.get('/', (_, res) => res.json({ SRV: { 'summoners-api-V2': 'ok' } }))

// Return Simple/Short Data
router.route('/sdata/:region&:name')
  .get(getSummonerShort)

// Return Extensive Data
router.route('/extdata/:region&:name')
  .get(getSummonerLong)

// Return Extensive Data
router.route('/clear/:region&:name')
  .get(clearCache)

// Return Assets
router.route('/icon/:id')
  .get(getSummonerIcon)

// Champion Mastery
router.route('/data/CM/:region&:id')
  .get(getChampionMastery)

export { router as summonerV2 }
