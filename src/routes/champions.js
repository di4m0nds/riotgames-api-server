import { Router } from 'express'
import championsController from '../controllers/champions.controller.js'

const { getChamps, getChamp, getFreeRotation } = championsController
const router = Router()

router.get('/', (_, res) => res.json({ active: true }))

router.route('/all')
  .get(getChamps)

router.route('/champ/:name')
  .get(getChamp)

router.route('/free/:region')
  .get(getFreeRotation)

export { router as champions }
