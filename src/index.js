import { app } from './app.js'

const SERVER_PORT = process.env.PORT || 6969

// Running
app.listen(SERVER_PORT, () => console.log(`Running on port: ${SERVER_PORT}`))
