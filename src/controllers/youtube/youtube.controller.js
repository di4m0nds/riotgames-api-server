import axios from 'axios'
import 'dotenv/config'

import { controlRequests } from '../../redis/redisHandler.js'

const youtubeController = {}

youtubeController.getVideosIds = async (req, res) => {
  const { search } = req.params

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  controlRequests(res, ip)

  const result = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?q=${encodeURI(search)}&key=${process.env.API_KEY_GC}&part=snippet&type=video&maxResults=3`)
    .catch(e => console.error(e))

  console.log(ip)

  res.json({
    videosIds: result?.data?.items?.map(item => item.id.videoId)
  })
}

youtubeController.getVideosIdsLive = async (req, res) => {
  const { search } = req.params
  const result = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?q=${encodeURI(search)}&key=${process.env.API_KEY_GC}&part=snippet&type=video&eventType=live&maxResults=10`)
    .catch(e => console.error(e))

  res.json({
    videosIds: result?.data?.items?.map(item => item.id.videoId)
  })
}

export default youtubeController
