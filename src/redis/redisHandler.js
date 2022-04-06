import { createClient } from 'redis'
import { promisify } from 'util'

import Redis from 'ioredis'
const redis = new Redis()

const redisConfig = {
  host: '127.0.0.1',
  port: 6379,
  legacyMode: true
}
const client = createClient(redisConfig)
const GET_CLIENT_ASYNC = promisify(client.get).bind(client)
const SET_CLIENT_ASYNC = promisify(client.set).bind(client)

const getRedisCacheKey = async (key) => {
  let reply = JSON.stringify({})
  if (!client.isOpen) await client.connect()
  reply = await GET_CLIENT_ASYNC(key)
  if (client.isOpen) await client.disconnect()

  if (reply) {
    return JSON.parse(reply)
  } else {
    return false
  }
}

const setRedisCacheKey = async (key, value) => {
  if (!client.isOpen) await client.connect()
  await SET_CLIENT_ASYNC(key, JSON.stringify(value))
  if (client.isOpen) await client.disconnect()
}

const deleteRedisCache = async () => {
  if (!client.isOpen) await client.connect()
  client.flushDb((err, succeeded) => {
    if (err) {
      console.log('error occured on redisClient.flushdb')
    } else console.log('✔ purge caches store in redis')
  })
}

const deleteRedisKeyCache = async (key) => {
  if (!client.isOpen) await client.connect()
  client.del(key, (err, succeeded) => {
    if (err) {
      console.log('error occured on redisClient.flushdb')
    } else console.log('✔ purge caches store in redis')
  })
}

const controlRequests = async (res, ip) => {
  const requests = await redis.incr(ip)

  let ttl
  if (requests === 1) {
    await redis.expire(ip, 60)
    ttl = 60
  } else {
    ttl = await redis.ttl(ip)
  }
  if (requests > 10) {
    return res.status(503).json({ response: 'error', message: 'Too many requests', ttl })
  }
}

export { getRedisCacheKey, setRedisCacheKey, deleteRedisCache, deleteRedisKeyCache, controlRequests }
