import 'reflect-metadata'
import router from './router'
import * as express from 'express'

const app = express()

router(app)

app.listen(8000, () => {
  console.log('Example app listening at http://localhost:8000')
})