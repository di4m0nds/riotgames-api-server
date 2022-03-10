import { app } from './app.js'

const SERVER_PORT = process.env.PORT || 6969

// Running
app.listen(
  SERVER_PORT,
  () => console.log(`CORS-enabled web server listening on port: http://localhost:${SERVER_PORT}`)
)
