//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// 		Dependencies
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
const express = require("express"),
  app = express(),
  request = require('request'),
  RateLimit = require('express-rate-limit'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  port = 3333,
  apiLimiter = new RateLimit({
    windowMs: 60 * 1000,
    max: 10,
    keyGenerator: (req) => {
      return req.ip + req.url
    },
    statusCode: 401
  }),
  options = {
    url: 'https://www.icanhazdadjoke.com/',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// 		Server
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/get', apiLimiter)

app.get('/get/:data', (req, res) => {
  let data = req.params.data
  console.log(`you sent me ${data}`)

  request(options, (err, response) => {
    if(err) throw err.msg

    let dadSays = JSON.parse(response.body)
    res.status(200).json({msg: dadSays.joke})
  })

})

app.get('/*', (req, res) => {
  res.status(404).json({msg: 'This endpoint is not valid '})
})

app.listen(port, function() {
  console.log("Server running on port: " + port)
})
