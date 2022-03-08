import { Router } from 'express'

const route = Router()

route.get('/', (req, res) => {
  res.json({
    'on-line': 'ok'
  })
})

export { route }
