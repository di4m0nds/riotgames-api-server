import { Router } from 'express'
import matchesController from '../../controllers/match/matches-v2.controller.js'

const { getMatches } = matchesController
const router = Router()

router.get('/', (_, res) => res.json({ 'matches-api': 'ok' }))

router.route('/:region&:puuid&:count')
  .get(getMatches)

export { router as matchesV2 }
