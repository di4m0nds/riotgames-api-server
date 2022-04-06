import { Router } from 'express'
import youtubeController from '../../controllers/youtube/youtube.controller.js'

const { getVideosIds, getVideosIdsLive } = youtubeController
const router = Router()

router.get('/', (_, res) => res.json({ active: true }))

router.route('/:search')
  .get(getVideosIds)

router.route('/lives/:search')
  .get(getVideosIdsLive)

export { router as ytV2 }
