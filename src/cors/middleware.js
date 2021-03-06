import cors from 'cors'
import 'dotenv/config'

const whiteList = ['http://localhost:3000', 'http://localhost:6969']

const corsOptions = { // eslint-disable-line
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      // console.log('Origin: ', origin, ' connected successfully!')
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

export default cors()
