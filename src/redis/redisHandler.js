import { createClient } from 'redis'
import { promisify } from 'util'

const client = createClient({
  host: '127.0.0.1',
  port: 6379,
  legacyMode: true
})

const GET_CLIENT_ASYNC = promisify(client.get).bind(client)
const SET_CLIENT_ASYNC = promisify(client.set).bind(client)

const getRedisCacheKey = async (key) => {
  if (!client.isOpen) await client.connect()
  const reply = await GET_CLIENT_ASYNC(key)
  await client.disconnect()
  if (reply) {
    return JSON.parse(reply)
  } else {
    return false
  }
}

const setRedisCacheKey = async (key, value) => {
  if (!client.isOpen) await client.connect()
  await SET_CLIENT_ASYNC(key, JSON.stringify(value))
  await client.disconnect()
}

export { getRedisCacheKey, setRedisCacheKey }
