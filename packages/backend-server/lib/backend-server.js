'use strict'

const express = require('express')
const axios = require('axios')
const env = require('./env')
const app = express()
const port = 3001

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./node_modules/@track-it/web-client/build'))
}

app.get('/api/tasks', async (req, res) => {
  const timeStampNow = Date.now()

  const clickUpResponse = await axios.get(`https://api.clickup.com/api/v1/team/${env.teamId}/task`, {
    headers: {
      Authorization: env.token
    },
    params: {
      'space_ids[]':  env.spaceId,
      date_updated_gt: timeStampNow - 2592000000, // 30 days before
      date_updated_lt: timeStampNow
    }
  })

  await res.json(clickUpResponse.data)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
