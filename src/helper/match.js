import { encrypt } from '../crypto/crypto.js'

const matchHelper = {}

matchHelper.matchesModel = (matches, queueIds) => {
  const model = []

  matches.forEach(current => {
    const meta = {
      matchId: encrypt(current?.metadata?.matchId),
      participants: current?.metadata?.participants?.map(id => encrypt(id))
    }
    const game = {
      creation: current?.info?.gameCreation,
      duration: current?.info?.gameDuration,
      id: current?.info?.gameId,
      mode: current?.info?.gameMode,
      name: current?.info?.gameName,
      type: current?.info?.gameType,
      patch: current?.info?.gameVersion,
      platformId: current?.info?.platformId,
      queue: queueIds.filter(queue => queue.queueId === current?.info?.queueId)[0],
      participants: current?.info?.participants?.map(player => {
        player.puuid = encrypt(player.puuid)
        player.summonerId = encrypt(player.summonerId)
        return player
      })
    }

    model.push({ meta, game })
  })

  return model
}

export default matchHelper
